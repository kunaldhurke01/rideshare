import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ActiveRide, HistoryRide, LocationItem, MatchCandidate, Passenger, StopPoint } from '../types';
import { createInitialActiveRide, DEMO_HISTORY_RIDES, DEMO_PRIMARY_PASSENGER, getMockCandidates, DEMO_DRIVER } from '../services/demoService';
import { DEFAULT_PICKUP, DEFAULT_DESTINATION, generateMultiStopRoute, getPositionAlongPath, getDrivingDistanceKm } from '../services/mapService';
import { calculateDynamicFares, calculateSoloFare } from '../services/fareEngine';
import { realtimeService } from '../services/realtimeService';
import { soundEffects } from '../utils/audio';

interface RideContextType {
  activeRide: ActiveRide;
  matchCandidates: MatchCandidate[];
  selectedMatch: MatchCandidate | null;
  historyRides: HistoryRide[];
  soundEnabled: boolean;
  simulationSpeed: number; // 1x, 2x, 5x
  isSimulatingJourney: boolean;

  // Actions
  toggleSound: () => void;
  setSimulationSpeed: (speed: number) => void;
  startBooking: (pickup: LocationItem, destination: LocationItem, allowSharing: boolean) => void;
  setSharingPreference: (allowSharing: boolean) => void;
  selectMatchCandidate: (candidate: MatchCandidate | null) => void;
  acceptMatch: (candidateId: string) => void;
  rejectMatch: (candidateId: string) => void;
  startActiveRide: () => void;
  toggleSimulationJourney: () => void;
  advanceVehicleProgress: (increment?: number) => void;
  completeRideJourney: () => void;
  submitPayment: (method: string) => Promise<boolean>;
  submitRating: (rating: number) => void;
  simulateTriggerMatch: () => void;
  resetAll: () => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRide, setActiveRide] = useState<ActiveRide>(() => createInitialActiveRide());
  const [matchCandidates, setMatchCandidates] = useState<MatchCandidate[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchCandidate | null>(null);
  const [historyRides, setHistoryRides] = useState<HistoryRide[]>(() => DEMO_HISTORY_RIDES);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(2); // 2x default for smooth demo
  const [isSimulatingJourney, setIsSimulatingJourney] = useState(false);

  // Sync sound setting
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundEffects.enabled = next;
      return next;
    });
  };

  // 1. Booking Action
  const startBooking = (pickup: LocationItem, destination: LocationItem, allowSharing: boolean) => {
    soundEffects.playClick();
    const newRide = createInitialActiveRide(pickup, destination, allowSharing);
    newRide.status = 'searching_driver';
    setActiveRide(newRide);

    // Populate mock candidates based on current pickup
    const candidates = getMockCandidates(newRide.primaryPassenger);
    setMatchCandidates(candidates);
    setSelectedMatch(candidates[0] || null);

    realtimeService.broadcast('RIDE_UPDATED', newRide);
  };

  // 2. Sharing Toggle Action
  const setSharingPreference = (allowSharing: boolean) => {
    soundEffects.playClick();
    setActiveRide((prev) => {
      const updated: ActiveRide = {
        ...prev,
        sharingEnabled: allowSharing,
        status: allowSharing ? 'searching_passengers' : 'driver_found'
      };
      realtimeService.broadcast('RIDE_UPDATED', updated);
      return updated;
    });
  };

  // 3. Select Match for viewing details
  const selectMatchCandidate = (candidate: MatchCandidate | null) => {
    soundEffects.playClick();
    setSelectedMatch(candidate);
  };

  // 4. Accept Passenger Match
  const acceptMatch = (candidateId: string) => {
    soundEffects.playMatchFound();
    const candidate = matchCandidates.find((c) => c.id === candidateId) || selectedMatch;
    if (!candidate) return;

    setActiveRide((prev) => {
      // Check vehicle capacity
      if (prev.currentPassengersCount + candidate.seatsRequested > prev.vehicleCapacity) {
        alert('Vehicle capacity reached! Cannot accept additional passenger.');
        return prev;
      }

      const newPassenger: Passenger = {
        id: candidate.id,
        name: candidate.passengerName,
        avatar: candidate.passengerAvatar,
        rating: candidate.passengerRating,
        phone: '+91 98765 ' + Math.floor(10000 + Math.random() * 90000),
        pickup: candidate.pickup,
        destination: candidate.destination,
        originalFare: candidate.originalFare,
        discountedFare: candidate.newFare,
        savings: candidate.estimatedSavings,
        seats: candidate.seatsRequested,
        joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Add stops in optimal logical sequence:
      // Current Stop -> New Passenger Pickup -> Existing Dropoff / New Dropoff
      const updatedStops: StopPoint[] = [
        ...prev.stops.filter((s) => s.status === 'completed'),
        {
          id: `stop-${candidate.id}-pickup`,
          passengerId: candidate.id,
          passengerName: candidate.passengerName,
          type: 'pickup',
          location: candidate.pickup,
          status: 'pending',
          etaMinutes: 6
        },
        ...prev.stops.filter((s) => s.type === 'dropoff' && s.status === 'pending'),
        {
          id: `stop-${candidate.id}-drop`,
          passengerId: candidate.id,
          passengerName: candidate.passengerName,
          type: 'dropoff',
          location: candidate.destination,
          status: 'pending',
          etaMinutes: 38
        }
      ];

      // Re-calculate dynamic multi-passenger fare
      const fareResult = calculateDynamicFares({
        primaryDistanceKm: prev.totalDistanceKm,
        candidateDistanceKm: candidate.sharedDistanceKm + candidate.detourDistanceKm,
        sharedDistanceKm: candidate.sharedDistanceKm,
        detourDistanceKm: candidate.detourDistanceKm,
        existingPassengersCount: prev.currentPassengersCount,
        newPassengersCount: candidate.seatsRequested
      });

      // Generate merged route waypoints
      const stopLocations = updatedStops.map((s) => s.location);
      const newRoute = generateMultiStopRoute(stopLocations);

      const updated: ActiveRide = {
        ...prev,
        additionalPassengers: [...prev.additionalPassengers, newPassenger],
        currentPassengersCount: prev.currentPassengersCount + candidate.seatsRequested,
        availableSeats: Math.max(0, prev.vehicleCapacity - (prev.currentPassengersCount + candidate.seatsRequested)),
        stops: updatedStops,
        routeCoordinates: newRoute.length > 0 ? newRoute : prev.routeCoordinates,
        totalDistanceKm: Number((prev.totalDistanceKm + candidate.detourDistanceKm).toFixed(1)),
        fareBreakdown: fareResult.breakdown,
        pendingMatch: undefined
      };

      realtimeService.broadcast('MATCH_ACCEPTED', { rideId: updated.id, passengerId: candidate.id });
      realtimeService.broadcast('RIDE_UPDATED', updated);
      return updated;
    });

    // Remove accepted candidate from search list
    setMatchCandidates((prev) => prev.filter((c) => c.id !== candidateId));
  };

  // 5. Reject Match
  const rejectMatch = (candidateId: string) => {
    soundEffects.playClick();
    setMatchCandidates((prev) => prev.filter((c) => c.id !== candidateId));
    if (selectedMatch?.id === candidateId) {
      setSelectedMatch(null);
    }
    realtimeService.broadcast('MATCH_REJECTED', { candidateId });
  };

  // 6. Start Active Live Ride
  const startActiveRide = () => {
    soundEffects.playClick();
    setActiveRide((prev) => {
      const updated: ActiveRide = {
        ...prev,
        status: 'ride_active',
        vehicleProgress: 0.08
      };
      realtimeService.broadcast('RIDE_UPDATED', updated);
      return updated;
    });
    setIsSimulatingJourney(true);
  };

  // 7. Advance Vehicle Along Route
  const advanceVehicleProgress = useCallback((increment = 0.04) => {
    setActiveRide((prev) => {
      if (prev.status !== 'ride_active') return prev;
      const nextProgress = Math.min(1.0, prev.vehicleProgress + increment);
      const currentLoc = getPositionAlongPath(prev.routeCoordinates, nextProgress);

      // Check stop completion
      const updatedStops = prev.stops.map((stop, idx) => {
        const stopProgress = (idx + 1) / (prev.stops.length + 1);
        if (nextProgress >= stopProgress && stop.status !== 'completed') {
          return { ...stop, status: 'completed' as const };
        }
        return stop;
      });

      const updated: ActiveRide = {
        ...prev,
        vehicleProgress: nextProgress,
        currentLocation: currentLoc.position,
        driver: {
          ...prev.driver,
          currentLocation: currentLoc.position,
          heading: currentLoc.heading
        },
        stops: updatedStops
      };

      if (nextProgress >= 1.0) {
        setIsSimulatingJourney(false);
      }

      return updated;
    });
  }, []);

  const toggleSimulationJourney = () => {
    setIsSimulatingJourney((prev) => !prev);
  };

  // 8. Complete Ride
  const completeRideJourney = () => {
    soundEffects.playSuccess();
    setIsSimulatingJourney(false);
    setActiveRide((prev) => {
      const updated: ActiveRide = {
        ...prev,
        status: 'fare_summary',
        vehicleProgress: 1.0
      };
      realtimeService.broadcast('RIDE_UPDATED', updated);
      return updated;
    });
  };

  // 9. Payment Submission
  const submitPayment = async (method: string): Promise<boolean> => {
    soundEffects.playClick();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    soundEffects.playSuccess();

    setActiveRide((prev) => {
      const updated: ActiveRide = {
        ...prev,
        status: 'completed'
      };

      // Add to Ride History
      const newHistoryItem: HistoryRide = {
        id: prev.id,
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pickupName: prev.primaryPassenger.pickup.name,
        destinationName: prev.primaryPassenger.destination.name,
        distanceKm: prev.totalDistanceKm,
        durationMinutes: prev.totalDurationMinutes,
        driverName: prev.driver.name,
        vehicleInfo: prev.driver.vehicleModel,
        shared: prev.additionalPassengers.length > 0,
        coPassengersCount: prev.additionalPassengers.length,
        farePaid: prev.fareBreakdown.finalPassengerFare,
        savings: prev.fareBreakdown.passengerSavings,
        status: 'completed',
        ratingGiven: 5
      };

      setHistoryRides((h) => [newHistoryItem, ...h]);
      realtimeService.broadcast('RIDE_COMPLETED', updated);
      return updated;
    });

    return true;
  };

  // 10. Rating Submission
  const submitRating = (rating: number) => {
    soundEffects.playSuccess();
    setHistoryRides((prev) =>
      prev.map((r, i) => (i === 0 ? { ...r, ratingGiven: rating } : r))
    );
  };

  // 11. Simulate Incoming Compatible Match (on-the-fly trigger)
  const simulateTriggerMatch = () => {
    const primary = activeRide.primaryPassenger;
    const candidates = getMockCandidates(primary);
    const candidate = candidates[Math.floor(Math.random() * candidates.length)];
    soundEffects.playMatchFound();
    setSelectedMatch(candidate);
    setActiveRide((prev) => ({
      ...prev,
      pendingMatch: candidate
    }));
    realtimeService.broadcast('MATCH_CANDIDATE_FOUND', candidate);
  };

  // 12. Reset to clean initial demo state
  const resetAll = () => {
    soundEffects.playClick();
    setIsSimulatingJourney(false);
    const initial = createInitialActiveRide();
    setActiveRide(initial);
    const candidates = getMockCandidates(initial.primaryPassenger);
    setMatchCandidates(candidates);
    setSelectedMatch(candidates[0]);
  };

  // Background journey simulation ticker
  useEffect(() => {
    if (!isSimulatingJourney) return;
    const interval = setInterval(() => {
      advanceVehicleProgress(0.015 * simulationSpeed);
    }, 600);

    return () => clearInterval(interval);
  }, [isSimulatingJourney, simulationSpeed, advanceVehicleProgress]);

  // Realtime subscription listener for multi-tab updates
  useEffect(() => {
    const unsub = realtimeService.subscribe('RIDE_UPDATED', (msg) => {
      if (msg.senderId !== realtimeService.getClientId()) {
        setActiveRide(msg.payload);
      }
    });

    return () => unsub();
  }, []);

  return (
    <RideContext.Provider
      value={{
        activeRide,
        matchCandidates,
        selectedMatch,
        historyRides,
        soundEnabled,
        simulationSpeed,
        isSimulatingJourney,
        toggleSound,
        setSimulationSpeed,
        startBooking,
        setSharingPreference,
        selectMatchCandidate,
        acceptMatch,
        rejectMatch,
        startActiveRide,
        toggleSimulationJourney,
        advanceVehicleProgress,
        completeRideJourney,
        submitPayment,
        submitRating,
        simulateTriggerMatch,
        resetAll
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};
