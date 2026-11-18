import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { PageTransition } from '../components/transitions/PageTransition';
import { 
  CheckCircle2, 
  Star, 
  Sparkles, 
  TrendingDown, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Clock, 
  Car,
  Home
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const RideCompletedPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeRide, submitRating, resetAll } = useRide();

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Clean EV', 'Smooth Driving']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tags = ['Punctual', 'Smooth Driving', 'Clean EV', 'Polite Driver', 'Great Route Overlap'];

  const toggleTag = (tag: string) => {
    soundEffects.playClick();
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRate = () => {
    soundEffects.playSuccess();
    submitRating(rating);
    setIsSubmitted(true);
  };

  const handleDone = () => {
    soundEffects.playClick();
    resetAll();
    navigate('/');
  };

  const fare = activeRide.fareBreakdown;
  const primary = activeRide.primaryPassenger;
  const driver = activeRide.driver;

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="glass-panel rounded-3xl p-6 sm:p-9 border border-emerald-500/30 shadow-3d space-y-8 text-center sm:text-left">
          {/* Top 3D Success Celebration Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-800">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 flex items-center justify-center shadow-glow-green animate-float">
                <CheckCircle2 size={42} className="text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xs font-bold shadow-3d-sm">
                ★
              </div>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-bold text-emerald-300">
                <Sparkles size={13} />
                <span>Payment Confirmed & Settled</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
                Ride Completed!
              </h1>
              <p className="text-xs text-slate-400">
                Thank you for choosing RideShare. You traveled sustainably and saved money!
              </p>
            </div>
          </div>

          {/* Section 23: Completed Trip Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount Paid</span>
              <span className="text-xl font-black text-emerald-400 mt-0.5 block">
                ₹{fare.finalPassengerFare}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Saved</span>
              <span className="text-xl font-black text-cyan-400 mt-0.5 block">
                ₹{fare.passengerSavings}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance</span>
              <span className="text-xl font-black text-white mt-0.5 block">
                {activeRide.totalDistanceKm} km
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Co-Riders</span>
              <span className="text-xl font-black text-purple-400 mt-0.5 block">
                +{activeRide.additionalPassengers.length} shared
              </span>
            </div>
          </div>

          {/* Route Overview */}
          <div className="p-4 rounded-2xl bg-[#0b132b]/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Navigation size={13} className="text-cyan-400" />
              <span className="font-semibold text-white">{primary.pickup.name}</span>
            </div>
            <div className="w-0.5 h-3 bg-slate-700 ml-1.5" />
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin size={13} className="text-purple-400" />
              <span className="font-semibold text-white">{primary.destination.name}</span>
            </div>
          </div>

          {/* Section 23: Rate Driver Card */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-11 h-11 rounded-xl object-cover border border-cyan-400"
                />
                <div className="text-left">
                  <span className="font-bold text-white text-sm block">Rate {driver.name}</span>
                  <span className="text-[11px] text-slate-400">{driver.vehicleModel}</span>
                </div>
              </div>

              {/* 5-Star Interactive Rating */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      soundEffects.playClick();
                      setRating(star);
                    }}
                    className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                  >
                    <Star
                      size={24}
                      className={
                        star <= rating
                          ? 'fill-amber-400 text-amber-400 scale-110 transition-transform'
                          : 'text-slate-600'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Compliment Tags */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 uppercase font-bold block text-left">
                Compliments & Highlights:
              </span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-3d-sm'
                          : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {!isSubmitted ? (
              <button
                onClick={handleRate}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-colors"
              >
                Submit Rating & Feedback
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs font-semibold text-emerald-300 text-center">
                ✓ Rating recorded! Thank you for supporting your driver.
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                navigate('/history');
              }}
              className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-colors flex-1 flex items-center justify-center gap-2"
            >
              <span>View Ride in History</span>
            </button>

            <button
              onClick={handleDone}
              className="glass-button p-4 rounded-2xl text-xs font-bold text-white flex-1 flex items-center justify-center gap-2 shadow-glow-cyan"
            >
              <Home size={15} />
              <span>Done • Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
