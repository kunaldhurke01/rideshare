import React, { useState } from 'react';
import { useRide } from '../context/RideContext';
import { PageTransition } from '../components/transitions/PageTransition';
import { 
  Bell, 
  Shield, 
  MapPin, 
  CreditCard, 
  Sliders, 
  Moon, 
  Volume2, 
  VolumeX, 
  Eye, 
  LogOut, 
  Zap, 
  Users, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import { soundEffects } from '../utils/audio';

export const SettingsPage: React.FC = () => {
  const { soundEnabled, toggleSound } = useRide();

  const [notifications, setNotifications] = useState(true);
  const [defaultSharing, setDefaultSharing] = useState(true);
  const [maxDetour, setMaxDetour] = useState(5); // minutes
  const [anonymizePhone, setAnonymizePhone] = useState(true);
  const [highAccuracyGps, setHighAccuracyGps] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    soundEffects.playSuccess();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>Account</span>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Preferences</span>
          </div>
          <h1 className="text-3xl font-black font-display text-white mt-1">
            Platform Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure sharing algorithms, privacy controls, and 3D visual modes
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 26: Sharing Algorithm Preferences */}
          <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 shadow-3d space-y-5">
            <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Sliders size={18} className="text-cyan-400" />
              <span>Smart Sharing Preferences</span>
            </h2>

            <div className="space-y-4 text-xs">
              {/* Default Allow Sharing */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Auto-Enable Live Sharing</span>
                  <span className="text-slate-400 text-[11px]">
                    Automatically search for compatible passengers on instant ride booking
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={defaultSharing}
                  onChange={(e) => {
                    soundEffects.playClick();
                    setDefaultSharing(e.target.checked);
                  }}
                  className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              {/* Max Detour Slider */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Maximum Detour Tolerance</span>
                    <span className="text-slate-400 text-[11px]">
                      Reject candidate matches if detour exceeds this limit
                    </span>
                  </div>
                  <span className="text-base font-extrabold text-cyan-400">
                    +{maxDetour} minutes
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={maxDetour}
                  onChange={(e) => setMaxDetour(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>2 min (Strict corridor)</span>
                  <span>5 min (Recommended)</span>
                  <span>12 min (Maximum savings)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Permissions */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
            <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Shield size={18} className="text-purple-400" />
              <span>Privacy & Location Security</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Phone Number Masking</span>
                  <span className="text-slate-400 text-[11px]">
                    Anonymize contact details for drivers and co-passengers via virtual VoIP
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={anonymizePhone}
                  onChange={(e) => {
                    soundEffects.playClick();
                    setAnonymizePhone(e.target.checked);
                  }}
                  className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">High Precision 3D Vector GPS</span>
                  <span className="text-slate-400 text-[11px]">
                    Provides sub-meter pickup accuracy at tech park gates
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={highAccuracyGps}
                  onChange={(e) => {
                    soundEffects.playClick();
                    setHighAccuracyGps(e.target.checked);
                  }}
                  className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Interface & Audio Preferences */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5">
            <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Zap size={18} className="text-emerald-400" />
              <span>Interactive & 3D Experience</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">3D Tactile Audio Feedback</span>
                  <span className="text-slate-400 text-[11px]">
                    Synthesizer chimes on match found, button presses, and payments
                  </span>
                </div>
                <button
                  onClick={toggleSound}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    soundEnabled
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  <span>{soundEnabled ? 'Enabled' : 'Muted'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="font-bold text-white block">Multi-Tab Real-Time Bus</span>
                  <span className="text-slate-400 text-[11px]">
                    BroadcastChannel sync across open browser tabs & devices
                  </span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Save / Status Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                soundEffects.playClick();
                alert('Signed out of RideShare session.');
              }}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>

            <button
              onClick={handleSave}
              className="glass-button px-7 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 shadow-glow-cyan"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
