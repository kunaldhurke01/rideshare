import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { Map3DView } from '../components/map/Map3DView';
import { PageTransition } from '../components/transitions/PageTransition';
import { 
  Car, 
  MapPin, 
  Navigation, 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  Pause, 
  FastForward, 
  CheckCircle2, 
  Sparkles,
  TrendingDown,
  Compass
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const LiveRidePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activeRide, 
    isSimulatingJourney, 
    toggleSimulationJourney, 
    advanceVehicleProgress, 
    completeRideJourney 
  } = useRide();

  const handleFinishRide = () => {
    soundEffects.playSuccess();
    completeRideJourney();
    navigate('/fare-summary');
  };

  const primary = activeRide.primaryPassenger;
  const driver = activeRide.driver;
  const progressPercent = Math.round(activeRide.vehicleProgress * 100);
  const remainingEta = Math.max(1, Math.round((1 - activeRide.vehicleProgress) * activeRide.totalDurationMinutes));

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>RideShare</span>
            <span>/</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Ride Tracking
            </span>
          </div>

          {/* Quick HUD status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              ETA: ~{remainingEta} mins
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
              Fare: ₹{activeRide.fareBreakdown.finalPassengerFare}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Ride Journey Dashboard & Stop Sequence (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-3d space-y-6">
              {/* Trip Header Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black font-display text-white tracking-tight">
                    En Route to Destination
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ride ID: {activeRide.id} • Dynamic Corridor Active
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Car size={24} className="animate-pulse" />
                </div>
              </div>

              {/* Vehicle Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Trip Progress</span>
                  <span className="font-bold text-cyan-400">{progressPercent}% Completed</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 rounded-full transition-all duration-300 shadow-glow-cyan"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Driver & Vehicle Quick Bar */}
              <div className="p-3.5 rounded-2xl bg-[#0b132b]/90 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={driver.photo}
                    alt={driver.name}
                    className="w-10 h-10 rounded-xl object-cover border border-cyan-400/50"
                  />
                  <div>
                    <div className="font-bold text-white">{driver.name}</div>
                    <div className="text-[11px] text-slate-400">{driver.vehicleModel}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-300">{driver.vehicleNumber}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">★ {driver.rating}</div>
                </div>
              </div>

              {/* Section 20 Core: Vehicle Capacity & Co-Passenger List */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users size={14} className="text-cyan-400" />
                    Vehicle Occupancy
                  </span>
                  <span className="font-extrabold text-cyan-300">
                    {activeRide.currentPassengersCount} / {activeRide.vehicleCapacity} Seats Occupied
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Primary Passenger (You) */}
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={primary.avatar}
                        alt={primary.name}
                        className="w-7 h-7 rounded-lg object-cover border border-cyan-400"
                      />
                      <div>
                        <span className="font-bold text-white block">{primary.name} (You)</span>
                        <span className="text-[10px] text-slate-400">Primary Rider</span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs">
                      Save ₹{activeRide.fareBreakdown.passengerSavings}
                    </span>
                  </div>

                  {/* Additional Co-passengers */}
                  {activeRide.additionalPassengers.map((cop) => (
                    <div
                      key={cop.id}
                      className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={cop.avatar}
                          alt={cop.name}
                          className="w-7 h-7 rounded-lg object-cover border border-purple-400"
                        />
                        <div>
                          <span className="font-bold text-white block">{cop.name}</span>
                          <span className="text-[10px] text-purple-300">
                            Joined at {cop.joinedAt || 'corridor'}
                          </span>
                        </div>
                      </div>
                      <span className="text-purple-300 font-semibold text-[11px]">
                        {cop.pickup.name.split(' ')[0]} → {cop.destination.name.split(' ')[0]}
                      </span>
                    </div>
                  ))}

                  {/* Empty Seats */}
                  {Array.from({ length: activeRide.availableSeats }).map((_, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl border border-dashed border-slate-800 text-[11px] text-slate-500 text-center"
                    >
                      Empty Seat Available
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 20 Core: Stop Sequence Architecture */}
              <div className="space-y-3">
                <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Dynamic Stop Sequence</span>
                  <span className="text-cyan-400 text-[11px]">Optimized Order</span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Current Vehicle Position */}
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3 text-cyan-200">
                    <Car size={16} className="text-cyan-400 shrink-0 animate-bounce" />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold block">Current Location</span>
                      <span className="text-[11px] text-slate-300 truncate block">
                        Moving smoothly along highway corridor
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                      NOW
                    </span>
                  </div>

                  {/* Waypoint stops */}
                  {activeRide.stops.map((stop, index) => {
                    const isDone = stop.status === 'completed';

                    return (
                      <div
                        key={stop.id}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                          isDone
                            ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                            : 'bg-slate-900/80 border-slate-700/80'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                          {isDone ? (
                            <CheckCircle2 size={16} className="text-emerald-400" />
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <span
                            className={`font-semibold block truncate ${
                              isDone ? 'line-through text-slate-400' : 'text-white'
                            }`}
                          >
                            {stop.type === 'pickup' ? `Pickup: ${stop.passengerName}` : `Drop: ${stop.passengerName}`}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {stop.location.name}
                          </span>
                        </div>

                        <span className="text-[11px] font-bold text-slate-400">
                          {isDone ? 'Completed' : `~${stop.etaMinutes}m`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Simulation Controls & End Ride CTA */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSimulationJourney}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex-1 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isSimulatingJourney ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isSimulatingJourney ? 'Pause Motion' : 'Play Motion'}</span>
                  </button>

                  <button
                    onClick={() => advanceVehicleProgress(0.12)}
                    className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex-1 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FastForward size={14} />
                    <span>Fast Forward</span>
                  </button>
                </div>

                <button
                  onClick={handleFinishRide}
                  className="glass-button w-full py-4 rounded-2xl text-xs font-extrabold text-white flex items-center justify-center gap-2 shadow-glow-green"
                >
                  <CheckCircle2 size={16} />
                  <span>Arrived at Destination • View Fare</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Live Vehicle Simulation Map (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-[460px] sm:h-[580px] rounded-3xl overflow-hidden relative shadow-3d border border-slate-800">
              <Map3DView
                primaryRoute={activeRide.routeCoordinates}
                pickupLocation={primary.pickup}
                dropoffLocation={primary.destination}
                stops={activeRide.stops}
                vehicleLocation={activeRide.currentLocation}
                vehicleHeading={activeRide.driver.heading}
                cameraTilt={36}
                interactive={true}
              />
            </div>

            {/* Live Telemetry Bar */}
            <div className="glass-panel-subtle rounded-2xl p-4 text-xs text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Speed</span>
                <span className="font-extrabold text-white text-base">34 km/h</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Distance</span>
                <span className="font-extrabold text-white text-base">{activeRide.totalDistanceKm} km</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Fare</span>
                <span className="font-extrabold text-emerald-400 text-base">₹{activeRide.fareBreakdown.finalPassengerFare}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Savings</span>
                <span className="font-extrabold text-cyan-400 text-base">₹{activeRide.fareBreakdown.passengerSavings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
