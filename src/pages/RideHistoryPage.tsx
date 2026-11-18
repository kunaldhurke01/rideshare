import React, { useState } from 'react';
import { useRide } from '../context/RideContext';
import { PageTransition } from '../components/transitions/PageTransition';
import { HistoryRide } from '../types';
import { 
  Clock, 
  MapPin, 
  Navigation, 
  Star, 
  Users, 
  Lock, 
  TrendingDown, 
  ShieldCheck, 
  ChevronRight, 
  Filter, 
  Car, 
  Receipt, 
  X 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const RideHistoryPage: React.FC = () => {
  const { historyRides } = useRide();
  const [filter, setFilter] = useState<'all' | 'shared' | 'solo'>('all');
  const [selectedRide, setSelectedRide] = useState<HistoryRide | null>(null);

  const filteredRides = historyRides.filter((ride) => {
    if (filter === 'shared') return ride.shared;
    if (filter === 'solo') return !ride.shared;
    return true;
  });

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Account</span>
              <span>/</span>
              <span className="text-cyan-400 font-semibold">Trips & Receipts</span>
            </div>
            <h1 className="text-3xl font-black font-display text-white mt-1">
              Ride History
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review your completed on-demand trips and corridor savings
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => {
                soundEffects.playClick();
                setFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-3d-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Rides ({historyRides.length})
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setFilter('shared');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'shared'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-3d-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Shared ({historyRides.filter((r) => r.shared).length})
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setFilter('solo');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'solo'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-3d-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Solo ({historyRides.filter((r) => !r.shared).length})
            </button>
          </div>
        </div>

        {/* Section 24: Rides List */}
        <div className="space-y-4">
          {filteredRides.length === 0 ? (
            /* Section 36: Empty State */
            <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-500">
                <Car size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No rides found in this filter</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Start an instant ride to view your dynamic corridor savings here.
                </p>
              </div>
            </div>
          ) : (
            filteredRides.map((ride) => (
              <div
                key={ride.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedRide(ride);
                }}
                className="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer card-3d-tilt"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400">{ride.date}</span>
                      {ride.shared ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-extrabold text-emerald-300">
                          <Users size={11} />
                          <span>Shared (+{ride.coPassengersCount} Co-rider)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300">
                          <Lock size={11} />
                          <span>Solo Ride</span>
                        </span>
                      )}
                      <span className="text-[11px] text-slate-500">ID: {ride.id}</span>
                    </div>

                    {/* Route Line */}
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span className="truncate">{ride.pickupName}</span>
                      <span className="text-cyan-400">→</span>
                      <span className="truncate">{ride.destinationName}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span>{ride.distanceKm} km</span>
                      <span>•</span>
                      <span>{ride.durationMinutes} mins</span>
                      <span>•</span>
                      <span>Driver: {ride.driverName}</span>
                      <span>•</span>
                      <span>{ride.vehicleInfo}</span>
                    </div>
                  </div>

                  {/* Right Fare & Savings */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/80">
                    <div className="text-xl font-black text-white">₹{ride.farePaid}</div>
                    {ride.savings > 0 ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                        <TrendingDown size={13} />
                        <span>Saved ₹{ride.savings}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 mt-0.5">Standard Fare</span>
                    )}
                    <div className="hidden sm:flex items-center gap-1 text-xs text-amber-400 mt-1 font-bold">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{ride.ratingGiven}.0</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detailed Ride Receipt Modal */}
        {selectedRide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div 
              className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-cyan-500/30 shadow-3d space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Receipt size={18} className="text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Ride Receipt #{selectedRide.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedRide(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Date & Time</span>
                    <span className="font-semibold text-white">{selectedRide.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Driver</span>
                    <span className="font-semibold text-white">{selectedRide.driverName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Vehicle</span>
                    <span className="font-semibold text-white">{selectedRide.vehicleInfo}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Pickup Point</span>
                    <span className="font-semibold text-cyan-300">{selectedRide.pickupName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Destination</span>
                    <span className="font-semibold text-purple-300">{selectedRide.destinationName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Distance & Duration</span>
                    <span className="font-semibold text-white">{selectedRide.distanceKm} km ({selectedRide.durationMinutes} min)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Amount Paid</span>
                    <span className="text-lg font-black text-white">₹{selectedRide.farePaid}</span>
                  </div>
                  {selectedRide.savings > 0 && (
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>Dynamic Corridor Savings</span>
                      <span>₹{selectedRide.savings}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedRide(null)}
                className="glass-button w-full py-3 rounded-xl text-xs font-bold text-white"
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};
