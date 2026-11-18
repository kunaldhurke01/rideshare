import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useRide } from '../../context/RideContext';
import { 
  Car, 
  Clock, 
  User, 
  Settings, 
  Volume2, 
  VolumeX, 
  Sliders, 
  ShieldCheck, 
  Users,
  Compass
} from 'lucide-react';

interface NavbarProps {
  onOpenDemoHub: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemoHub }) => {
  const { activeRide, soundEnabled, toggleSound } = useRide();
  const location = useLocation();

  const isRideActive = activeRide.status === 'ride_active';
  const isMatchFound = activeRide.status === 'match_found' || activeRide.pendingMatch;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070b19]/85 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Wordmark & Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl py-1 px-1.5"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-glow-cyan transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#0b132b] rounded-[10px] flex items-center justify-center overflow-hidden">
              <img src="/logo-icon.svg" alt="RideShare" className="w-7 h-7 object-contain" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                RideShare
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                LIVE
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium -mt-1 hidden sm:block">
              Dynamic Instant Ride-Sharing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 glass-panel-subtle px-3 py-1.5 rounded-2xl border border-slate-800">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-3d-sm border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/book"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-3d-sm border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            Book Ride
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-3d-sm border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            Ride History
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-3d-sm border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-3d-sm border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            Settings
          </NavLink>
        </nav>

        {/* Right Actions & Badges */}
        <div className="flex items-center gap-2.5">
          {/* Active Ride Live Indicator */}
          {activeRide.status !== 'idle' && (
            <Link
              to={
                activeRide.status === 'ride_active'
                  ? '/ride'
                  : activeRide.status === 'searching_passengers'
                  ? '/live-sharing'
                  : activeRide.status === 'driver_found'
                  ? '/driver-found'
                  : activeRide.status === 'fare_summary'
                  ? '/fare-summary'
                  : activeRide.status === 'payment_pending'
                  ? '/payment'
                  : '/finding-driver'
              }
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isRideActive
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 animate-pulse'
                  : isMatchFound
                  ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
                  : 'bg-blue-950/60 border-blue-500/40 text-cyan-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-ping" />
              <span>
                {isRideActive
                  ? 'Ride Live'
                  : activeRide.status === 'searching_passengers'
                  ? 'Sharing Active'
                  : 'Active Booking'}
              </span>
              {activeRide.additionalPassengers.length > 0 && (
                <span className="bg-emerald-500/20 px-1.5 py-0.2 rounded text-[10px] font-bold text-emerald-400">
                  +{activeRide.additionalPassengers.length} shared
                </span>
              )}
            </Link>
          )}

          {/* Audio Feedback Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-slate-800/70 border-slate-700 text-cyan-400 hover:bg-slate-700/60'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
            }`}
            title={soundEnabled ? 'Mute 3D audio feedback' : 'Enable 3D audio feedback'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Simulation & Demo Hub Button */}
          <button
            onClick={onOpenDemoHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/60 to-blue-900/60 border border-purple-500/30 text-purple-200 hover:border-purple-400 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-3d-sm"
            title="Open Demo & Multi-Passenger Simulator"
          >
            <Sliders size={15} className="text-purple-400" />
            <span className="hidden sm:inline">Demo Hub</span>
          </button>
        </div>
      </div>
    </header>
  );
};
