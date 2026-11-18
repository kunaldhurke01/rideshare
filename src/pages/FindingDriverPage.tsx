import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { Map3DView } from '../components/map/Map3DView';
import { PageTransition } from '../components/transitions/PageTransition';
import { 
  Car, 
  Compass, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const FindingDriverPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeRide } = useRide();
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Auto transition to Driver Found page after finding driver
  useEffect(() => {
    const timer = setTimeout(() => {
      soundEffects.playMatchFound();
      navigate('/driver-found');
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleInstantDispatch = () => {
    soundEffects.playMatchFound();
    navigate('/driver-found');
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <span>Book Ride</span>
          <span>/</span>
          <span className="text-cyan-400 font-semibold">Finding Driver</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3D Radar Search Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-cyan-500/30 shadow-3d space-y-6 relative overflow-hidden">
              {/* Glowing decorative background glow */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

              {/* Attractive 3D Radar Visualizer */}
              <div className="flex flex-col items-center justify-center pt-4 pb-2">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Outer pulsating concentric rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
                  <div className="absolute inset-3 rounded-full border border-cyan-500/40 animate-pulse" />
                  <div className="absolute inset-7 rounded-full border border-purple-500/40 animate-spin-slow" />
                  <div className="absolute inset-10 rounded-full border border-cyan-400/60" />

                  {/* Center Car Icon with 3D depth */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-cyan z-10">
                    <Car size={30} className="text-white animate-bounce" />
                  </div>
                </div>

                <div className="mt-5 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-bold text-cyan-300">
                    <Radio size={12} className="animate-pulse text-cyan-400" />
                    <span>Scanning Pune Corridor</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
                    Finding your ride...
                  </h1>
                  <p className="text-xs text-slate-400">
                    Contacting nearest verified EV drivers near {activeRide.primaryPassenger.pickup.name}
                  </p>
                </div>
              </div>

              {/* Dispatch Progress Steps */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-slate-200 font-semibold">Available Drivers Nearby</span>
                  </div>
                  <span className="font-bold text-emerald-400">4 within 1.2 km</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Clock size={14} className="text-cyan-400" />
                    <span className="text-slate-200 font-semibold">Average Dispatch Time</span>
                  </div>
                  <span className="font-bold text-white">~3 mins pickup</span>
                </div>
              </div>

              {/* Route Summary Pill */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-medium">
                  <Navigation size={13} />
                  <span className="truncate">{activeRide.primaryPassenger.pickup.name}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400 font-medium">
                  <MapPin size={13} />
                  <span className="truncate">{activeRide.primaryPassenger.destination.name}</span>
                </div>
              </div>

              {/* Instant match button for rapid demo testing */}
              <button
                onClick={handleInstantDispatch}
                className="glass-button w-full py-3.5 rounded-2xl text-xs font-bold text-white flex items-center justify-center gap-2"
              >
                <span>Connect Driver Instantly</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Column: 3D Map with Animated Radar Search Waves (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-[460px] sm:h-[540px] rounded-3xl overflow-hidden relative shadow-3d border border-slate-800">
              <Map3DView
                primaryRoute={activeRide.routeCoordinates}
                pickupLocation={activeRide.primaryPassenger.pickup}
                dropoffLocation={activeRide.primaryPassenger.destination}
                vehicleLocation={activeRide.driver.currentLocation}
                vehicleHeading={activeRide.driver.heading}
                isSearchingAnimation={true}
                cameraTilt={36}
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
