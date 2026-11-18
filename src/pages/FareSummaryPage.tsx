import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { PageTransition } from '../components/transitions/PageTransition';
import { 
  Receipt, 
  TrendingDown, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Route, 
  Info, 
  Clock, 
  Car, 
  ChevronLeft 
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const FareSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeRide } = useRide();

  const fare = activeRide.fareBreakdown;
  const isShared = activeRide.additionalPassengers.length > 0;

  const handleProceedToPayment = () => {
    soundEffects.playClick();
    navigate('/payment');
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Live Ride</span>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Fare Summary</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-bold text-cyan-300">
            <Receipt size={13} />
            <span>Trip Concluded</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Main Fare Card with 3D Depth */}
          <div className="glass-panel rounded-3xl p-6 sm:p-9 border border-cyan-500/30 shadow-3d space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">
                  Transparent Cost Breakdown
                </span>
                <h1 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
                  Ride Fare Summary
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Trip ID: #{activeRide.id} • {activeRide.primaryPassenger.pickup.name} to {activeRide.primaryPassenger.destination.name}
                </p>
              </div>

              {/* Total Final Fare Highlight */}
              <div className="text-left sm:text-right bg-slate-900/80 sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-bold block">
                  Amount Payable
                </span>
                <div className="text-4xl sm:text-5xl font-black font-display text-emerald-400 tracking-tight mt-0.5">
                  ₹{fare.finalPassengerFare}
                </div>
                {fare.passengerSavings > 0 && (
                  <span className="inline-block mt-1 text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    You saved ₹{fare.passengerSavings} by sharing!
                  </span>
                )}
              </div>
            </div>

            {/* Section 21 Core: Detailed Line-Item Breakdown */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Fare Calculation Breakdown
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-300 py-1">
                  <div>
                    <span className="font-semibold block">Original Solo Fare</span>
                    <span className="text-xs text-slate-400">
                      Standard metered fare for {activeRide.totalDistanceKm} km
                    </span>
                  </div>
                  <span className="font-bold text-white text-base">₹{fare.originalSoloFare}</span>
                </div>

                {isShared ? (
                  <div className="flex items-center justify-between text-emerald-400 py-2 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <TrendingDown size={16} />
                        <span>Dynamic Sharing Corridor Discount</span>
                      </div>
                      <span className="text-xs text-emerald-300/80">
                        {fare.sharedDistanceKm} km overlapping highway corridor with co-passengers
                      </span>
                    </div>
                    <span className="font-black text-emerald-400 text-lg">-₹{fare.passengerSavings}</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                    No co-passenger joined this trip. Standard solo rate applies.
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-300 py-1">
                  <div>
                    <span className="font-semibold block">RideShare Platform Technology Fee</span>
                    <span className="text-xs text-slate-400">
                      Corridor route optimization, 24/7 safety & dispatch
                    </span>
                  </div>
                  <span className="font-semibold text-slate-300">Included in total</span>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between font-bold text-base">
                  <span className="text-white">Net Final Fare</span>
                  <span className="text-2xl font-black text-emerald-400">
                    ₹{fare.finalPassengerFare}
                  </span>
                </div>
              </div>
            </div>

            {/* Economic Sustainability & Driver Earnings Note */}
            <div className="p-4 rounded-2xl bg-[#0b132b]/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold block">
                  Driver Payout
                </span>
                <span className="text-base font-extrabold text-white block">
                  ₹{fare.driverEarnings}
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Higher payout than solo trips
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold block">
                  Total Corridor Distance
                </span>
                <span className="text-base font-extrabold text-white block">
                  {activeRide.totalDistanceKm} km
                </span>
                <span className="text-[11px] text-slate-400">
                  Shared: {fare.sharedDistanceKm} km
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 uppercase text-[10px] font-bold block">
                  Carbon Emission Saved
                </span>
                <span className="text-base font-extrabold text-cyan-400 block">
                  ~1.4 kg CO₂
                </span>
                <span className="text-[11px] text-slate-400">
                  By merging duplicate trips
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleProceedToPayment}
                className="glass-button w-full py-4 rounded-2xl text-base font-extrabold text-white flex items-center justify-center gap-2 shadow-glow-cyan"
              >
                <span>Proceed to Payment</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
