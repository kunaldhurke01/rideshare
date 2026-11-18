import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { Map3DView } from '../components/map/Map3DView';
import { PageTransition } from '../components/transitions/PageTransition';
import { 
  Star, 
  ShieldCheck, 
  Car, 
  Phone, 
  Navigation, 
  MapPin, 
  Clock, 
  Sparkles, 
  Users, 
  Lock, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const DriverFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeRide, setSharingPreference } = useRide();

  const handleAllowSharing = () => {
    soundEffects.playClick();
    setSharingPreference(true);
    navigate('/live-sharing');
  };

  const handleKeepPrivate = () => {
    soundEffects.playClick();
    setSharingPreference(false);
    navigate('/ride');
  };

  const driver = activeRide.driver;
  const primary = activeRide.primaryPassenger;
  const potentialSavings = Math.round(primary.originalFare * 0.15);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <span>Finding Driver</span>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">Driver Confirmed</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Driver Card & Sharing Decision (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-3d space-y-6">
              {/* Confirmed Banner */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-300">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Driver Assigned & En Route</span>
                </div>
                <div className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                  <Clock size={13} />
                  <span>ETA 3 mins</span>
                </div>
              </div>

              {/* Driver Profile Card */}
              <div className="p-4 rounded-2xl bg-[#0b132b]/90 border border-slate-800 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={driver.photo}
                      alt={driver.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-3d-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-0.5 rounded-full">
                      <ShieldCheck size={14} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white truncate">{driver.name}</h2>
                      <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30 text-xs font-bold text-amber-300">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span>{driver.rating}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {driver.totalTrips.toLocaleString()} trips • Verified Pro Driver
                    </div>
                    <div className="text-xs font-semibold text-cyan-300 mt-1 flex items-center gap-1.5">
                      <Car size={13} />
                      <span>{driver.vehicleModel}</span>
                    </div>
                  </div>
                </div>

                {/* License Plate & Vehicle Specs */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehicle Plate</span>
                    <span className="font-extrabold text-white tracking-widest block mt-0.5">
                      {driver.vehicleNumber}
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehicle Capacity</span>
                    <span className="font-extrabold text-cyan-300 block mt-0.5">
                      {activeRide.vehicleCapacity} Seats Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Trip Fare and Route Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Solo Ride Fare:</span>
                  <span className="text-lg font-extrabold text-white">₹{primary.originalFare}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Corridor Distance:</span>
                  <span className="font-bold text-slate-200">{activeRide.totalDistanceKm} km</span>
                </div>
              </div>

              {/* Section 12 Core Choice: Want to share this ride? */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-blue-950/40 to-[#070b19] border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-400" />
                    <h3 className="text-base font-extrabold text-white font-display">
                      Want to share this ride?
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Save ₹{potentialSavings}+
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Compatible passengers traveling along your exact route can join. Detours are capped under 5 minutes and each co-passenger lowers your final bill!
                </p>

                {/* Two Clear Workflow Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleAllowSharing}
                    className="glass-button py-3.5 px-4 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-glow-purple group"
                  >
                    <Users size={15} />
                    <span>Allow Sharing</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={handleKeepPrivate}
                    className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all"
                  >
                    <Lock size={14} />
                    <span>Keep Private</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Map with Driver Vehicle and Route (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-[460px] sm:h-[540px] rounded-3xl overflow-hidden relative shadow-3d border border-slate-800">
              <Map3DView
                primaryRoute={activeRide.routeCoordinates}
                pickupLocation={primary.pickup}
                dropoffLocation={primary.destination}
                vehicleLocation={driver.currentLocation}
                vehicleHeading={driver.heading}
                cameraTilt={32}
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
