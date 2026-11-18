import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide } from '../context/RideContext';
import { PageTransition } from '../components/transitions/PageTransition';
import confetti from 'canvas-confetti';
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeRide, submitPayment } = useRide();

  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'wallet' | 'cash'>('upi');
  const [upiId, setUpiId] = useState('kunal@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);

  const fare = activeRide.fareBreakdown.finalPassengerFare;

  const handlePayNow = async () => {
    soundEffects.playClick();
    setIsProcessing(true);

    try {
      // Trigger confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      await submitPayment(selectedMethod);
      navigate('/ride-completed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/fare-summary')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to Fare Summary</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            <Lock size={12} className="text-emerald-400" />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-9 border border-cyan-500/30 shadow-3d space-y-8">
          {/* Top Payment Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">
                Secure Checkout
              </span>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
                Select Payment
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Payment for Ride #{activeRide.id}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 uppercase font-bold block">
                Total Due
              </span>
              <div className="text-4xl font-black font-display text-emerald-400 mt-0.5">
                ₹{fare}
              </div>
            </div>
          </div>

          {/* Section 22: Payment Methods Selection */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. UPI */}
              <div
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedMethod('upi');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative card-3d-tilt ${
                  selectedMethod === 'upi'
                    ? 'bg-gradient-to-r from-cyan-950/70 to-blue-950/70 border-cyan-400 shadow-glow-cyan'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {selectedMethod === 'upi' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">UPI (Fastest)</span>
                    <span className="text-[11px] text-slate-400">GPay, PhonePe, Paytm, BHIM</span>
                  </div>
                </div>
                {selectedMethod === 'upi' && (
                  <div className="mt-3 pt-3 border-t border-cyan-500/20">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter UPI ID (e.g. name@okhdfc)"
                      className="w-full bg-[#070b19] border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                )}
              </div>

              {/* 2. Credit / Debit Card */}
              <div
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedMethod('card');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative card-3d-tilt ${
                  selectedMethod === 'card'
                    ? 'bg-gradient-to-r from-purple-950/70 to-blue-950/70 border-purple-400 shadow-glow-purple'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {selectedMethod === 'card' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-400 text-black flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">Credit / Debit Card</span>
                    <span className="text-[11px] text-slate-400">Visa, Mastercard, RuPay</span>
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-400">
                  •••• 4920 (Saved HDFC Diners Club)
                </div>
              </div>

              {/* 3. RideShare Wallet */}
              <div
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedMethod('wallet');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative card-3d-tilt ${
                  selectedMethod === 'wallet'
                    ? 'bg-gradient-to-r from-emerald-950/70 to-cyan-950/70 border-emerald-400 shadow-glow-green'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {selectedMethod === 'wallet' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-400 text-black flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">RideShare Wallet</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      Available Balance: ₹850
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Cash to Driver */}
              <div
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedMethod('cash');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative card-3d-tilt ${
                  selectedMethod === 'cash'
                    ? 'bg-gradient-to-r from-amber-950/70 to-slate-900/70 border-amber-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {selectedMethod === 'cash' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Banknote size={18} />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block">Pay Cash to Driver</span>
                    <span className="text-[11px] text-slate-400">Hand physical cash directly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Guarantee Note */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
            <span>
              Your payment is processed through an automated instant settlement gateway. Driver receives payout instantly upon ride sign-off.
            </span>
          </div>

          {/* Pay Now Button */}
          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="glass-button w-full py-4 rounded-2xl text-base font-extrabold text-white flex items-center justify-center gap-2 shadow-glow-cyan disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </span>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Pay ₹{fare} Now</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </PageTransition>
  );
};
