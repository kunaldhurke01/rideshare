import { Driver, HistoryRide, LocationItem, MatchCandidate, Passenger, StopPoint, ActiveRide } from '../types';
import { DEFAULT_PICKUP, DEFAULT_DESTINATION, LOCATIONS, getDrivingDistanceKm, generateRoutePoints } from './mapService';
import { calculateSoloFare, calculateDynamicFares } from './fareEngine';
import { createMatchCandidate } from './matchingEngine';

export const DEMO_DRIVER: Driver = {
  id: 'drv-8841',
  name: 'Ramesh Kadam',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  rating: 4.92,
  totalTrips: 1840,
  vehicleModel: 'Tata Nexon EV Max (Electric)',
  vehicleNumber: 'MH 12 AB 4590',
  vehicleColor: 'Cyber Blue',
  vehicleCapacity: 4,
  phone: '+91 98230 44102',
  currentLocation: { lat: 18.5925, lng: 73.7420 },
  heading: 75
};

export const DEMO_PRIMARY_PASSENGER: Passenger = {
  id: 'usr-kunal',
  name: 'Kunal Deshmukh',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  rating: 4.95,
  phone: '+91 98901 23456',
  pickup: DEFAULT_PICKUP, // Hinjawadi
  destination: DEFAULT_DESTINATION, // Kharadi
  originalFare: 420,
  discountedFare: 365,
  savings: 55,
  seats: 1
};

export const MOCK_CANDIDATE_POOLS = [
  {
    id: 'match-rohit',
    name: 'Rohit Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 4.88,
    pickupId: 'loc-wakad', // Wakad
    destId: 'loc-vimannagar', // Viman Nagar
    seatsRequested: 1
  },
  {
    id: 'match-neha',
    name: 'Neha Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 4.96,
    pickupId: 'loc-baner', // Baner
    destId: 'loc-kharadi', // Kharadi
    seatsRequested: 1
  },
  {
    id: 'match-arjun',
    name: 'Arjun Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 4.75,
    pickupId: 'loc-aundh', // Aundh
    destId: 'loc-magarpatta', // Magarpatta
    seatsRequested: 1
  }
];

export function getMockCandidates(primaryPassenger: Passenger): MatchCandidate[] {
  return MOCK_CANDIDATE_POOLS.map((candidate) => {
    const pickup = LOCATIONS.find((l) => l.id === candidate.pickupId) || LOCATIONS[1];
    const destination = LOCATIONS.find((l) => l.id === candidate.destId) || LOCATIONS[7];
    return createMatchCandidate(
      candidate.id,
      candidate.name,
      candidate.avatar,
      candidate.rating,
      pickup,
      destination,
      primaryPassenger,
      candidate.seatsRequested
    );
  });
}

export function createInitialActiveRide(
  pickup = DEFAULT_PICKUP,
  destination = DEFAULT_DESTINATION,
  sharingEnabled = true
): ActiveRide {
  const distanceKm = getDrivingDistanceKm(pickup.coordinates, destination.coordinates);
  const soloFare = calculateSoloFare(distanceKm);
  const routePoints = generateRoutePoints(pickup.coordinates, destination.coordinates);

  const initialStops: StopPoint[] = [
    {
      id: 'stop-p1-pickup',
      passengerId: DEMO_PRIMARY_PASSENGER.id,
      passengerName: DEMO_PRIMARY_PASSENGER.name,
      type: 'pickup',
      location: pickup,
      status: 'pending',
      etaMinutes: 4
    },
    {
      id: 'stop-p1-drop',
      passengerId: DEMO_PRIMARY_PASSENGER.id,
      passengerName: DEMO_PRIMARY_PASSENGER.name,
      type: 'dropoff',
      location: destination,
      status: 'pending',
      etaMinutes: 42
    }
  ];

  return {
    id: 'ride-rs-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date().toISOString(),
    status: 'booking',
    primaryPassenger: {
      ...DEMO_PRIMARY_PASSENGER,
      pickup,
      destination,
      originalFare: soloFare,
      discountedFare: soloFare,
      savings: 0
    },
    additionalPassengers: [],
    driver: DEMO_DRIVER,
    sharingEnabled,
    vehicleCapacity: 4,
    currentPassengersCount: 1,
    availableSeats: 3,
    stops: initialStops,
    currentStopIndex: 0,
    fareBreakdown: {
      originalSoloFare: soloFare,
      totalBaseFare: 60,
      distanceRate: 15.5,
      totalDistanceKm: distanceKm,
      sharedDistanceKm: 0,
      sharingDiscount: 0,
      detourAdjustment: 0,
      platformFee: 45,
      driverEarnings: Math.round(soloFare * 0.88),
      finalPassengerFare: soloFare,
      passengerSavings: 0
    },
    routeCoordinates: routePoints,
    vehicleProgress: 0.05,
    currentLocation: routePoints[0] || pickup.coordinates,
    totalDistanceKm: distanceKm,
    totalDurationMinutes: 42
  };
}

export const DEMO_HISTORY_RIDES: HistoryRide[] = [
  {
    id: 'ride-rs-902144',
    date: 'Yesterday, 6:45 PM',
    pickupName: 'Hinjawadi Phase 1',
    destinationName: 'Viman Nagar',
    distanceKm: 24.2,
    durationMinutes: 46,
    driverName: 'Vikram Joshi',
    vehicleInfo: 'Hyundai Aura (White)',
    shared: true,
    coPassengersCount: 1,
    farePaid: 345,
    savings: 65,
    status: 'completed',
    ratingGiven: 5
  },
  {
    id: 'ride-rs-882019',
    date: '04 Oct, 9:15 AM',
    pickupName: 'Wakad Junction',
    destinationName: 'Shivajinagar Hub',
    distanceKm: 14.8,
    durationMinutes: 28,
    driverName: 'Santosh Pawar',
    vehicleInfo: 'Maruti Dzire (Silver)',
    shared: true,
    coPassengersCount: 2,
    farePaid: 210,
    savings: 45,
    status: 'completed',
    ratingGiven: 5
  },
  {
    id: 'ride-rs-812030',
    date: '01 Oct, 11:30 PM',
    pickupName: 'Koregaon Park',
    destinationName: 'Baner High Street',
    distanceKm: 18.1,
    durationMinutes: 32,
    driverName: 'Amit Nair',
    vehicleInfo: 'Tata Tigor EV (Teal)',
    shared: false,
    coPassengersCount: 0,
    farePaid: 340,
    savings: 0,
    status: 'completed',
    ratingGiven: 4
  }
];
