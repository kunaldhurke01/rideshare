import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { LOCATIONS, DEFAULT_PICKUP, DEFAULT_DESTINATION, getDrivingDistanceKm, getDrivingDurationMinutes, generateRoutePoints } from '../services/mapService';
import { calculateSoloFare } from '../services/fareEngine';
import { Map3DView } from '../components/map/Map3DView';
import { PageTransition } from '../components/transitions/PageTransition';
import { 
  MapPin, 
  Navigation, 
  ArrowRight, 
  Clock, 
  Route, 
  Sparkles, 
  Users, 
  Lock, 
  Check, 
  Info,
  Car
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const BookRidePage: React.FC = () => {
  const navigate = useNavigate();
  const { startBooking } = useRide();

  const [pickupId, setPickupId] = useState(DEFAULT_PICKUP.id);
  const [destId, setDestId] = useState(DEFAULT_DESTINATION.id);
  const [allowSharing, setAllowSharing] = useState(true);

  const pickupLocation = useMemo(
    () => LOCATIONS.find((l) => l.id === pickupId) || DEFAULT_PICKUP,
    [pickupId]
  );
  const destLocation = useMemo(
    () => LOCATIONS.find((l) => l.id === destId) || DEFAULT_DESTINATION,
    [destId]
  );

  const distanceKm = useMemo(
    () => getDrivingDistanceKm(pickupLocation.coordinates, destLocation.coordinates),
    [pickupLocation, destLocation]
  );

  const durationMin = useMemo(
    () => getDrivingDurationMinutes(distanceKm),
    [distanceKm]
  );

  const estimatedFare = useMemo(
    () => calculateSoloFare(distanceKm),
    [distanceKm]
  );

  const estimatedSharedFare = useMemo(
    () => Math.round(estimatedFare * 0.85),
    [estimatedFare]
  );

  const routePoints = useMemo(
    () => generateRoutePoints(pickupLocation.coordinates, destLocation.coordinates),
    [pickupLocation, destLocation]
  );

  const handleFindRide = () => {
    soundEffects.playClick();
    startBooking(pickupLocation, destLocation, allowSharing);
    navigate('/finding-driver');
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb / Status */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <span>RideShare</span>
          <span>/</span>
          <span className="text-cyan-400 font-semibold">Book Instant Ride</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Booking Form & Sharing Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-3d space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                  Where are you heading?
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Instant on-demand cab dispatch across Pune tech corridors
                </p>
              </div>

              {/* Location Selectors */}
              <div className="space-y-4">
                {/* Pickup Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Navigation size={13} className="text-cyan-400" />
                    Pickup Location (Current)
                  </label>
                  <div className="relative">
                    <select
                      value={pickupId}
                      onChange={(e) => setPickupId(e.target.value)}
                      className="w-full bg-[#0a1128] border border-cyan-500/30 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none shadow-3d-sm cursor-pointer"
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id} className="bg-[#0b132b] text-white">
                          {loc.name} — {loc.area}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400">
                      ▼
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 px-1">{pickupLocation.address}</div>
                </div>

                {/* Connecting Line Visualizer */}
                <div className="pl-6 py-0.5">
                  <div className="w-0.5 h-5 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
                </div>

                {/* Destination Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <MapPin size={13} className="text-purple-400" />
                    Destination Point
                  </label>
                  <div className="relative">
                    <select
                      value={destId}
                      onChange={(e) => setDestId(e.target.value)}
                      className="w-full bg-[#0a1128] border border-purple-500/30 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none shadow-3d-sm cursor-pointer"
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id} className="bg-[#0b132b] text-white">
                          {loc.name} — {loc.area}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
                      ▼
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 px-1">{destLocation.address}</div>
                </div>
              </div>

              {/* Trip Estimates Metric Cards */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Distance
                  </span>
                  <span className="text-base font-extrabold text-white mt-0.5 block">
                    {distanceKm} km
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Travel Time
                  </span>
                  <span className="text-base font-extrabold text-white mt-0.5 block">
                    ~{durationMin} min
                  </span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Base Solo Fare
                  </span>
                  <span className="text-base font-extrabold text-cyan-300 mt-0.5 block">
                    ₹{estimatedFare}
                  </span>
                </div>
              </div>

              {/* Section 10 Core Choice: Allow Ride Sharing? */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-purple-950/30 to-[#070b19] border border-cyan-500/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Allow Ride Sharing?</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  RideShare can search for live passengers traveling along your route. Sharing reduces your fare to approximately{' '}
                  <strong className="text-emerald-400 font-bold">₹{estimatedSharedFare}</strong> (save ~₹{estimatedFare - estimatedSharedFare}) with a guaranteed maximum detour under 5 minutes.
                </p>

                {/* Clear Decision Choice Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setAllowSharing(true);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      allowSharing
                        ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-cyan-400 shadow-glow-cyan text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {allowSharing && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Users size={14} className={allowSharing ? 'text-cyan-400' : ''} />
                      <span>Allow Sharing</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                      Save ₹{estimatedFare - estimatedSharedFare}+
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setAllowSharing(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      !allowSharing
                        ? 'bg-slate-800 border-slate-600 text-white shadow-3d-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {!allowSharing && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-slate-300 text-black flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Lock size={14} />
                      <span>Keep Private</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Standard ₹{estimatedFare}</div>
                  </button>
                </div>
              </div>

              {/* Main Find a Ride CTA */}
              <button
                onClick={handleFindRide}
                className="glass-button w-full py-4 rounded-2xl text-base font-extrabold text-white flex items-center justify-center gap-2 shadow-glow-cyan"
              >
                <span>Find a Ride</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right Column: 3D Route Preview Map (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-[460px] sm:h-[540px] rounded-3xl overflow-hidden relative shadow-3d border border-slate-800">
              <Map3DView
                primaryRoute={routePoints}
                pickupLocation={pickupLocation}
                dropoffLocation={destLocation}
                interactive={true}
                cameraTilt={32}
              />
            </div>

            {/* Explanatory note below map */}
            <div className="glass-panel-subtle rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-3">
              <Info size={16} className="text-cyan-400 shrink-0" />
              <span>
                3D route preview rendered via RideShare Corridor Vectorizer. You can tilt, rotate, and zoom the map using the controls at bottom right.
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
