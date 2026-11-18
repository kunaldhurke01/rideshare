import React from 'react';
import { X, Zap, Users, Route, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-3d max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">
              Instant Dynamic Co-Mobility
            </span>
            <h2 className="text-2xl font-black font-display text-white mt-0.5">
              How RideShare Works
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="my-6 space-y-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            Unlike traditional carpooling apps where you must schedule rides days in advance, <strong className="text-white">RideShare is 100% on-demand</strong>. You book a regular solo ride right now, and our dynamic corridor engine matches passengers requesting rides along your path in real time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel-subtle rounded-2xl p-4 border border-cyan-500/20">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-white text-base mb-1">1. Book Instant Ride</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your pickup and destination. A verified driver is dispatched immediately like any top-tier on-demand cab.
              </p>
            </div>

            <div className="glass-panel-subtle rounded-2xl p-4 border border-purple-500/20">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <Route size={20} />
              </div>
              <h3 className="font-bold text-white text-base mb-1">2. Corridor Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If you opt in to share, our Smart Matching Engine searches for live passengers along your driving vector with &gt;80% corridor overlap.
              </p>
            </div>

            <div className="glass-panel-subtle rounded-2xl p-4 border border-emerald-500/20">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-white text-base mb-1">3. Dynamic Fare Split</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You save 15–30% on your fare, joining passengers pay less, and the driver earns higher total revenue than solo trips.
              </p>
            </div>
          </div>

          {/* Key Differentiator Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30">
            <h4 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} /> Why it's not traditional carpooling
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>No pre-planning or awkward text messages days before.</li>
              <li>You always have a dedicated, confirmed professional driver right away.</li>
              <li>Sharing is 100% voluntary—you can keep the ride private anytime with one click.</li>
              <li>Strict detour caps: detour never exceeds 10–12 minutes.</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <Link
            to="/book"
            onClick={onClose}
            className="glass-button px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2"
          >
            <span>Book Your Ride Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
