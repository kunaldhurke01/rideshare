import React, { useState } from 'react';
import { PageTransition } from '../components/transitions/PageTransition';
import { 
  User, 
  Star, 
  TrendingDown, 
  Users, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Award, 
  Car, 
  Plus, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const ProfilePage: React.FC = () => {
  const [savedPlaces, setSavedPlaces] = useState([
    { id: '1', title: 'Home', address: 'Amar Renaissance, Sopan Baug, Pune', icon: '🏠' },
    { id: '2', title: 'Work', address: 'EON IT Park, Phase 2, Kharadi, Pune', icon: '💼' },
    { id: '3', title: 'Gym', address: 'Gold\'s Gym, Kalyani Nagar', icon: '⚡' },
    { id: '4', title: 'Airport', address: 'Pune International Airport, Lohegaon', icon: '✈️' }
  ]);

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Profile Header Card with 3D Depth */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-3d space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                alt="Kunal Deshmukh"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-cyan-400 shadow-glow-cyan"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-400 to-cyan-500 text-black px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-3d-sm">
                <ShieldCheck size={12} />
                <span>Verified</span>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Kunal Deshmukh
                </h1>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold w-fit mx-auto sm:mx-0">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>4.95 Passenger Rating</span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Member since January 2025 • Hinjawadi – Kharadi Corridor Frequent Commuter
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300">
                  Elite Corridor Co-Rider
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                  Top 5% Eco-Commuter
                </span>
              </div>
            </div>
          </div>

          {/* Section 25: User Stats Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center card-3d-tilt">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Total Rides</span>
              <span className="text-2xl font-black text-white mt-1 block">24</span>
              <span className="text-[11px] text-cyan-400 mt-0.5">Across Pune</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center card-3d-tilt">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Total Savings</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">₹1,420</span>
              <span className="text-[11px] text-emerald-400 mt-0.5">Via smart sharing</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center card-3d-tilt">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Sharing Ratio</span>
              <span className="text-2xl font-black text-purple-400 mt-1 block">82%</span>
              <span className="text-[11px] text-purple-300 mt-0.5">Rides shared</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center card-3d-tilt">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">CO₂ Reduced</span>
              <span className="text-2xl font-black text-cyan-300 mt-1 block">34.8 kg</span>
              <span className="text-[11px] text-cyan-400 mt-0.5">Eco impact</span>
            </div>
          </div>
        </div>

        {/* Saved Locations & Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saved Locations */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
                <MapPin size={18} className="text-cyan-400" />
                <span>Saved Locations</span>
              </h2>
              <button
                onClick={() => soundEffects.playClick()}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Place</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {savedPlaces.map((place) => (
                <div
                  key={place.id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{place.icon}</span>
                    <div>
                      <span className="font-bold text-white block">{place.title}</span>
                      <span className="text-slate-400 text-[11px] truncate max-w-[200px] block">
                        {place.address}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
                <CreditCard size={18} className="text-purple-400" />
                <span>Payment Methods</span>
              </h2>
              <button
                onClick={() => soundEffects.playClick()}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Method</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Google Pay UPI</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-400 font-bold px-2 py-0.2 rounded">
                      Default
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">kunal@okhdfcbank</span>
                </div>
                <CheckCircle2 size={16} className="text-cyan-400" />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">HDFC Diners Club Credit Card</span>
                  <span className="text-[11px] text-slate-400">•••• •••• •••• 4920</span>
                </div>
                <ChevronRight size={14} className="text-slate-500" />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">RideShare In-App Wallet</span>
                  <span className="text-[11px] text-emerald-400 font-semibold">Balance: ₹850.00</span>
                </div>
                <button
                  onClick={() => soundEffects.playClick()}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/40"
                >
                  Top Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
