import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { Map3DView } from '../components/map/Map3DView';
import { PageTransition } from '../components/transitions/PageTransition';
import { MatchCandidate } from '../types';
import { generateRoutePoints } from '../services/mapService';
import { 
  Users, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Route, 
  TrendingDown, 
  Check, 
  MapPin, 
  Navigation, 
  Sliders, 
  ShieldCheck,
  Star,
  Lock,
  Radio
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const LiveSharingPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activeRide, 
    matchCandidates, 
    selectMatchCandidate, 
    startActiveRide 
  } = useRide();

  // Active preview candidate on map
  const [hoveredCandidate, setHoveredCandidate] = useState<MatchCandidate | null>(
    matchCandidates[0] || null
  );

  useEffect(() => {
    if (matchCandidates.length > 0 && !hoveredCandidate) {
      setHoveredCandidate(matchCandidates[0]);
    }
  }, [matchCandidates, hoveredCandidate]);

  const candidateRoute = hoveredCandidate
    ? generateRoutePoints(hoveredCandidate.pickup.coordinates, hoveredCandidate.destination.coordinates)
    : [];

  const handleViewMatch = (candidate: MatchCandidate) => {
    soundEffects.playClick();
    selectMatchCandidate(candidate);
    navigate('/match-details');
  };

  const handleStartSolo = () => {
    soundEffects.playClick();
    startActiveRide();
    navigate('/ride');
  };

  const primary = activeRide.primaryPassenger;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <span>Driver Found</span>
          <span>/</span>
          <span className="text-purple-400 font-semibold">Live Passenger Matching</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Matches & Capacity (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-purple-500/30 shadow-3d space-y-5">
              {/* Header Status */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-bold text-purple-300">
                  <Radio size={14} className="animate-pulse text-purple-400" />
                  <span>Live Corridor Scanner Active</span>
                </div>
                {/* Vehicle Capacity Meter */}
                <div className="text-xs font-bold text-cyan-300 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1.5">
                  <Users size={13} />
                  <span>{activeRide.currentPassengersCount} / {activeRide.vehicleCapacity} Seats Occupied</span>
                </div>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                  Finding compatible passengers...
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  RideShare algorithms prioritize corridor direction and minimal detour, not just raw distance.
                </p>
              </div>

              {/* Matched Passengers Candidate List */}
              <div className="space-y-3.5">
                <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Live Compatible Requests ({matchCandidates.length})</span>
                  <span className="text-emerald-400 font-bold">Ordered by Match %</span>
                </div>

                {matchCandidates.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-400">
                      No additional compatible passengers found along your corridor right now.
                    </p>
                    <button
                      onClick={handleStartSolo}
                      className="glass-button px-5 py-2.5 rounded-xl text-xs font-bold text-white inline-flex items-center gap-1.5"
                    >
                      <span>Continue Solo</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  matchCandidates.map((candidate) => {
                    const isSelected = hoveredCandidate?.id === candidate.id;

                    return (
                      <div
                        key={candidate.id}
                        onMouseEnter={() => setHoveredCandidate(candidate)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative card-3d-tilt ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-950/70 via-blue-950/60 to-slate-900/90 border-purple-400 shadow-glow-purple'
                            : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Match Score Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-extrabold text-xs">
                              {candidate.matchScore}% Route Match
                            </span>
                            <span className="text-emerald-400 font-bold text-xs">
                              Save ₹{candidate.estimatedSavings}
                            </span>
                          </div>

                          <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                            <Clock size={12} />
                            <span>+{candidate.detourMinutes} min detour</span>
                          </div>
                        </div>

                        {/* Passenger Details */}
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={candidate.passengerAvatar}
                            alt={candidate.passengerName}
                            className="w-10 h-10 rounded-xl object-cover border border-purple-400/40"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-white text-sm truncate">
                                {candidate.passengerName}
                              </h3>
                              <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
                                <Star size={11} className="fill-amber-400 text-amber-400" />
                                <span>{candidate.passengerRating}</span>
                              </div>
                            </div>
                            <div className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                              <span className="truncate">{candidate.pickup.name}</span>
                              <span>→</span>
                              <span className="truncate">{candidate.destination.name}</span>
                            </div>
                          </div>
                        </div>

                        {/* Route Overlap Details */}
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300 mb-3">
                          <span>{candidate.sharedDistanceKm} km shared highway corridor</span>
                          <span className="text-cyan-400 font-bold">{candidate.overlapPercentage}% overlap</span>
                        </div>

                        {/* View Match Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMatch(candidate);
                          }}
                          className="glass-button w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-3d-sm"
                        >
                          <span>View Match & Route Comparison</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Keep Solo Bottom Fallback */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Prefer not to wait for matches?</span>
                <button
                  onClick={handleStartSolo}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                >
                  <Lock size={12} />
                  <span>Start Solo Ride (₹{primary.originalFare})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Map Visualizing Dual Overlapping Routes (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-[460px] sm:h-[540px] rounded-3xl overflow-hidden relative shadow-3d border border-slate-800">
              <Map3DView
                primaryRoute={activeRide.routeCoordinates}
                secondaryRoute={candidateRoute}
                pickupLocation={primary.pickup}
                dropoffLocation={primary.destination}
                secondaryPickup={hoveredCandidate?.pickup}
                secondaryDropoff={hoveredCandidate?.destination}
                vehicleLocation={activeRide.driver.currentLocation}
                vehicleHeading={activeRide.driver.heading}
                cameraTilt={34}
              />
            </div>

            {/* Overlap Legend Note */}
            <div className="glass-panel-subtle rounded-2xl p-4 text-xs text-slate-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                <span>Your Route: {primary.pickup.name} → {primary.destination.name}</span>
              </div>
              {hoveredCandidate && (
                <div className="flex items-center gap-2 text-purple-300">
                  <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_#c084fc]" />
                  <span>Candidate: {hoveredCandidate.passengerName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
