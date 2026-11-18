import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRide } from '../../context/RideContext';
import { 
  X, 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw, 
  UserPlus, 
  Layers, 
  MapPin, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface DemoHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoHubModal: React.FC<DemoHubModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    activeRide,
    simulationSpeed,
    setSimulationSpeed,
    isSimulatingJourney,
    toggleSimulationJourney,
    advanceVehicleProgress,
    simulateTriggerMatch,
    resetAll
  } = useRide();

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-panel w-full max-w-2xl rounded-3xl p-6 border border-cyan-500/30 shadow-3d max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/40 text-purple-300">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                RideShare Simulation & Test Hub
              </h2>
              <p className="text-xs text-slate-400">
                Test multi-page workflow steps, live match engine, detour simulation & vehicle capacity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Current State Summary */}
        <div className="my-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400">Ride Status:</span>{' '}
            <span className="font-semibold text-cyan-400 uppercase tracking-wider">{activeRide.status}</span>
          </div>
          <div>
            <span className="text-slate-400">Occupancy:</span>{' '}
            <span className="font-semibold text-emerald-400">
              {activeRide.currentPassengersCount} / {activeRide.vehicleCapacity} Seats
            </span>
          </div>
          <div>
            <span className="text-slate-400">Current Fare:</span>{' '}
            <span className="font-semibold text-white">₹{activeRide.fareBreakdown.finalPassengerFare}</span>
            {activeRide.fareBreakdown.passengerSavings > 0 && (
              <span className="text-emerald-400 ml-1 font-bold">(-₹{activeRide.fareBreakdown.passengerSavings})</span>
            )}
          </div>
          <div>
            <span className="text-slate-400">Sharing:</span>{' '}
            <span className={`font-semibold ${activeRide.sharingEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
              {activeRide.sharingEnabled ? 'Enabled' : 'Private'}
            </span>
          </div>
        </div>

        {/* 1. Direct Page / Route Navigator */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers size={14} className="text-cyan-400" />
            Direct Multi-Page Navigation
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => navigateTo('/')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">1. Home</div>
              <div className="text-[10px] text-slate-400">Hero & 3D city scene</div>
            </button>
            <button
              onClick={() => navigateTo('/book')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">2. Book Ride</div>
              <div className="text-[10px] text-slate-400">Pickup, dest, sharing opt-in</div>
            </button>
            <button
              onClick={() => navigateTo('/finding-driver')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">3. Finding Driver</div>
              <div className="text-[10px] text-slate-400">3D radar search animation</div>
            </button>
            <button
              onClick={() => navigateTo('/driver-found')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">4. Driver Found</div>
              <div className="text-[10px] text-slate-400">Driver card & share choice</div>
            </button>
            <button
              onClick={() => navigateTo('/live-sharing')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">5. Live Sharing</div>
              <div className="text-[10px] text-slate-400">Route compatibility radar</div>
            </button>
            <button
              onClick={() => navigateTo('/match-details')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">6. Match Details</div>
              <div className="text-[10px] text-slate-400">Side-by-side & detour breakdown</div>
            </button>
            <button
              onClick={() => navigateTo('/ride')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">7. Live Ride</div>
              <div className="text-[10px] text-slate-400">Moving 3D car & stop sequence</div>
            </button>
            <button
              onClick={() => navigateTo('/fare-summary')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">8. Fare Summary</div>
              <div className="text-[10px] text-slate-400">Transparent price breakdown</div>
            </button>
            <button
              onClick={() => navigateTo('/payment')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">9. Payment</div>
              <div className="text-[10px] text-slate-400">UPI, Card, Wallet options</div>
            </button>
            <button
              onClick={() => navigateTo('/ride-completed')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">10. Completed</div>
              <div className="text-[10px] text-slate-400">3D celebration & driver rating</div>
            </button>
            <button
              onClick={() => navigateTo('/history')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">Ride History</div>
              <div className="text-[10px] text-slate-400">Past shared vs solo rides</div>
            </button>
            <button
              onClick={() => navigateTo('/profile')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 text-left transition-all hover:scale-[1.02]"
            >
              <div className="font-semibold text-slate-200">Profile & Stats</div>
              <div className="text-[10px] text-slate-400">Total savings & sharing rating</div>
            </button>
          </div>
        </div>

        {/* 2. Simulation Triggers & Controls */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <UserPlus size={14} className="text-purple-400" />
            Live Event Triggers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                simulateTriggerMatch();
                navigateTo('/live-sharing');
              }}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/40 hover:border-purple-400 text-purple-200 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              <UserPlus size={16} className="text-purple-400" />
              <span>Simulate Incoming Compatible Passenger</span>
            </button>

            <button
              onClick={() => {
                toggleSimulationJourney();
              }}
              className="p-3 rounded-xl bg-slate-800/70 border border-slate-700 hover:border-cyan-500/50 text-cyan-200 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              {isSimulatingJourney ? <Pause size={16} /> : <Play size={16} />}
              <span>{isSimulatingJourney ? 'Pause Vehicle Movement' : 'Resume Vehicle Motion'}</span>
            </button>

            <button
              onClick={() => advanceVehicleProgress(0.15)}
              className="p-3 rounded-xl bg-slate-800/70 border border-slate-700 hover:border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              <FastForward size={16} className="text-emerald-400" />
              <span>Advance Vehicle +15% on Route</span>
            </button>

            <button
              onClick={() => {
                resetAll();
                navigateTo('/');
              }}
              className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 hover:border-rose-600 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-[1.01]"
            >
              <RotateCcw size={16} className="text-rose-400" />
              <span>Reset All State to Clean Demo</span>
            </button>
          </div>
        </div>

        {/* 3. Speed Multiplier */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs">
          <span className="text-slate-300 font-medium">Simulation Motion Speed:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 5, 10].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimulationSpeed(spd)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  simulationSpeed === spd
                    ? 'bg-cyan-500 text-black shadow-3d-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
