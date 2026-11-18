import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Clock, User, Settings, Car } from 'lucide-react';
import { useRide } from '../../context/RideContext';

export const MobileNav: React.FC = () => {
  const { activeRide } = useRide();
  const isRideActive = activeRide.status === 'ride_active';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b19]/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 safe-area-pb">
      <div className="flex items-center justify-around">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-medium transition-colors ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Home size={19} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/book"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-medium transition-colors ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Compass size={19} />
          <span>Book</span>
        </NavLink>

        {/* If ride is active, center button becomes Live Ride */}
        {isRideActive && (
          <NavLink
            to="/ride"
            className="flex flex-col items-center gap-1 -mt-5 bg-gradient-to-r from-emerald-500 to-cyan-500 p-3 rounded-2xl shadow-glow-green text-white font-bold"
          >
            <Car size={22} className="animate-bounce" />
            <span className="text-[10px]">Ride</span>
          </NavLink>
        )}

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-medium transition-colors ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Clock size={19} />
          <span>History</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-medium transition-colors ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <User size={19} />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-medium transition-colors ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};
