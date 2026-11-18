import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { Map3DView } from '../components/map/Map3DView';
import { PageTransition } from '../components/transitions/PageTransition';
import { generateRoutePoints } from '../services/mapService';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Clock, 
  Route, 
  TrendingDown, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Navigation, 
  DollarSign, 
  ChevronLeft 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const MatchDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activeRide, 
    selectedMatch, 
    matchCandidates, 
    acceptMatch, 
    rejectMatch, 
    startActiveRide 
  } = useRide();

  // If no match selected, fallback to first available
  const match = selectedMatch || matchCandidates[0];

  const primary = activeRide.primaryPassenger;

  const candidateRoute = useMemo(() => {
    if (!match) return [];
    return generateRoutePoints(match.pickup.coordinates, match.destination.coordinates);
  }, [match]);

  // Combined shared route for visual overlap
  const sharedOverlapRoute = useMemo(() => {
    if (!match) return [];
    // The shared portion between match.pickup and match.destination
    return generateRoutePoints(match.pickup.coordinates, match.destination.coordinates);
  }, [match]);

  if (!match) {
    return (
      <PageTransition>
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">No Match Selected</h2>
          <p className="text-slate-400 text-sm">
            Please select a compatible passenger from the Live Sharing radar.
          </p>
          <button
            onClick={() => navigate('/live-sharing')}
            className="glass-button px-6 py-3 rounded-2xl text-xs font-bold text-white"
          >
            Back to Live Sharing
          </button>
        </div>
      </PageTransition>
    );
  }

  const handleAccept = () => {
    soundEffects.playMatchFound();
    acceptMatch(match.id);
    startActiveRide();
    navigate('/ride');
  };

  const handleDecline = () => {
    soundEffects.playClick();
    rejectMatch(match.id);
    navigate('/live-sharing');
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/live-sharing')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to Live Candidates</span>
          </button>

          <div className="text-xs font-semibold text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/40">
            Route Compatibility Analysis
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Match Score Breakdown & Fare Redistribution (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-3d space-y-6">
              {/* Top Match Score Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-black text-base shadow-glow-green">
                    {match.matchScore}%
                  </div>
                  <div>
                    <h1 className="text-lg font-black font-display text-white">
                      Smart Route Match
                    </h1>
                    <span className="text-xs text-emerald-400 font-semibold">
                      High Corridor Alignment
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Your Savings
                  </span>
                  <span className="text-xl font-black text-emerald-400 block">
                    ₹{match.estimatedSavings}
                  </span>
                </div>
              </div>

              {/* Passenger Card */}
              <div className="p-4 rounded-2xl bg-[#0b132b]/80 border border-slate-800 flex items-center gap-4">
                <img
                  src={match.passengerAvatar}
                  alt={match.passengerName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-400 shadow-3d-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white truncate">{match.passengerName}</h2>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span>{match.passengerRating}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Requesting 1 Seat • Instant pickup</div>
                  <div className="text-xs text-cyan-300 font-medium mt-1">
                    {match.pickup.name} → {match.destination.name}
                  </div>
                </div>
              </div>

              {/* Side-by-Side Corridor Comparison */}
              <div className="space-y-3">
                <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                  Route Corridor Comparison
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* Your Route */}
                  <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                      <Navigation size={12} />
                      <span>YOUR ROUTE</span>
                    </div>
                    <div className="text-white font-semibold">{primary.pickup.name}</div>
                    <div className="text-slate-400 text-[11px]">to</div>
                    <div className="text-white font-semibold">{primary.destination.name}</div>
                  </div>

                  {/* Other Passenger */}
                  <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                      <MapPin size={12} />
                      <span>OTHER PASSENGER</span>
                    </div>
                    <div className="text-white font-semibold">{match.pickup.name}</div>
                    <div className="text-slate-400 text-[11px]">to</div>
                    <div className="text-white font-semibold">{match.destination.name}</div>
                  </div>
                </div>
              </div>

              {/* Section 16 Detailed Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Shared Route
                  </span>
                  <span className="text-base font-extrabold text-white mt-0.5 block">
                    {match.sharedDistanceKm} km
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Extra Detour
                  </span>
                  <span className="text-base font-extrabold text-amber-400 mt-0.5 block">
                    +{match.detourDistanceKm} km
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Extra Time
                  </span>
                  <span className="text-base font-extrabold text-amber-400 mt-0.5 block">
                    +{match.detourMinutes} min
                  </span>
                </div>
              </div>

              {/* Section 16 Transparent Fare Redistribution */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Previous Solo Fare:</span>
                  <span className="line-through text-slate-400">₹{match.originalFare}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Shared Route Adjustment:</span>
                  <span className="font-bold text-emerald-400">-₹{match.estimatedSavings}</span>
                </div>

                <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-between font-bold text-sm">
                  <span className="text-white">Your New Fare:</span>
                  <span className="text-xl font-black text-emerald-300">₹{match.newFare}</span>
                </div>
              </div>

              {/* Section 16 Decision Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAccept}
                  className="glass-button py-4 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-glow-green"
                >
                  <CheckCircle2 size={16} />
                  <span>Accept Passenger</span>
                </button>

                <button
                  onClick={handleDecline}
                  className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all"
                >
                  <XCircle size={16} />
                  <span>Keep Ride Private</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Dual Route Merge Map (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-[460px] sm:h-[540px] rounded-3xl overflow-hidden relative shadow-3d border border-slate-800">
              <Map3DView
                primaryRoute={activeRide.routeCoordinates}
                secondaryRoute={candidateRoute}
                sharedRoute={sharedOverlapRoute}
                pickupLocation={primary.pickup}
                dropoffLocation={primary.destination}
                secondaryPickup={match.pickup}
                secondaryDropoff={match.destination}
                vehicleLocation={activeRide.driver.currentLocation}
                vehicleHeading={activeRide.driver.heading}
                cameraTilt={32}
              />
            </div>

            <div className="glass-panel-subtle rounded-2xl p-4 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="font-semibold text-emerald-300">
                  Green Corridor: {match.sharedDistanceKm} km merged shared segment
                </span>
              </div>
              <div className="text-slate-400">
                Detour: only +{match.detourMinutes} min off primary highway axis
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
