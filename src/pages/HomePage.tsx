import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero3DScene } from '../components/home/Hero3DScene';
import { HowItWorksModal } from '../components/home/HowItWorksModal';
import { PageTransition } from '../components/transitions/PageTransition';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Users, 
  Route, 
  TrendingDown, 
  Clock, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleBookClick = () => {
    soundEffects.playClick();
    navigate('/book');
  };

  return (
    <PageTransition>
      <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden">
        {/* 3D WebGL Background Scene */}
        <Hero3DScene />

        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 flex-1 flex flex-col justify-center">
          <div className="max-w-3xl space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-glow-cyan animate-float">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Next-Gen Corridor Optimization • Instant Booking</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.08]">
              Your Ride.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Route.
              </span>{' '}
              <br className="hidden sm:inline" />
              Share When It Makes Sense.
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              Book a guaranteed instant ride right now. If compatible passengers request a ride along your route, RideShare intelligently merges your corridors—reducing your fare while keeping detours under 5 minutes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={handleBookClick}
                className="glass-button px-8 py-4 rounded-2xl text-base font-bold text-white flex items-center gap-3 shadow-glow-cyan group"
              >
                <span>Book a Ride</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowHowItWorks(true);
                }}
                className="glass-panel-subtle px-7 py-4 rounded-2xl text-base font-semibold text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500/50 transition-all hover:bg-slate-800/60"
              >
                How RideShare Works
              </button>
            </div>

            {/* Live Corridor Quick Stats */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl">
              <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 card-3d-tilt">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
                  <TrendingDown size={16} />
                  <span>Avg. Fare Saved</span>
                </div>
                <div className="text-2xl font-black text-white">28% – 35%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">₹45 - ₹120 per shared trip</div>
              </div>

              <div className="glass-panel rounded-2xl p-4 border border-purple-500/20 card-3d-tilt">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-1">
                  <Clock size={16} />
                  <span>Max Detour Cap</span>
                </div>
                <div className="text-2xl font-black text-white">&lt; 5 mins</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Algorithmically enforced</div>
              </div>

              <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 card-3d-tilt col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                  <ShieldCheck size={16} />
                  <span>Instant Driver</span>
                </div>
                <div className="text-2xl font-black text-white">100% Solo First</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Never wait for carpoolers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Ribbon */}
        <div className="relative z-10 border-t border-slate-800/80 bg-[#070b19]/90 backdrop-blur-xl py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Zap size={18} />
              </div>
              <div>
                <span className="font-bold text-slate-200 block">No Pre-Scheduled Planning</span>
                <span>Every ride is requested live right now</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Route size={18} />
              </div>
              <div>
                <span className="font-bold text-slate-200 block">Smart Vector Compatibility</span>
                <span>Matches route corridor, not just raw distance</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingDown size={18} />
              </div>
              <div>
                <span className="font-bold text-slate-200 block">Fair Economic Redistribution</span>
                <span>Transparent savings for riders, extra for drivers</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Users size={18} />
              </div>
              <div>
                <span className="font-bold text-slate-200 block">Vehicle Capacity Aware</span>
                <span>Up to 4 seats dynamically managed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <HowItWorksModal isOpen={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
      </div>
    </PageTransition>
  );
};
