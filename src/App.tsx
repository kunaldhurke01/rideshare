import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { RideProvider } from './context/RideContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { DemoHubModal } from './components/layout/DemoHubModal';

// Pages
import { HomePage } from './pages/HomePage';
import { BookRidePage } from './pages/BookRidePage';
import { FindingDriverPage } from './pages/FindingDriverPage';
import { DriverFoundPage } from './pages/DriverFoundPage';
import { LiveSharingPage } from './pages/LiveSharingPage';
import { MatchDetailsPage } from './pages/MatchDetailsPage';
import { LiveRidePage } from './pages/LiveRidePage';
import { FareSummaryPage } from './pages/FareSummaryPage';
import { PaymentPage } from './pages/PaymentPage';
import { RideCompletedPage } from './pages/RideCompletedPage';
import { RideHistoryPage } from './pages/RideHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ArrowLeft, Car } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
        <Car size={32} />
      </div>
      <h1 className="text-2xl font-bold text-white font-display">Route Not Found</h1>
      <p className="text-xs text-slate-400">
        The destination you are trying to reach does not exist in the RideShare network.
      </p>
      <a
        href="/"
        className="glass-button inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white shadow-3d-sm"
      >
        <ArrowLeft size={14} />
        <span>Return to Home</span>
      </a>
    </div>
  );
};

const AnimatedRoutes: React.FC<{ onOpenDemoHub: () => void }> = ({ onOpenDemoHub }) => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex flex-col pb-16 md:pb-0">
      <Navbar onOpenDemoHub={onOpenDemoHub} />

      <main className="flex-1 perspective-container">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<BookRidePage />} />
            <Route path="/finding-driver" element={<FindingDriverPage />} />
            <Route path="/driver-found" element={<DriverFoundPage />} />
            <Route path="/live-sharing" element={<LiveSharingPage />} />
            <Route path="/match-details" element={<MatchDetailsPage />} />
            <Route path="/match-details/:matchId" element={<MatchDetailsPage />} />
            <Route path="/ride" element={<LiveRidePage />} />
            <Route path="/fare-summary" element={<FareSummaryPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/ride-completed" element={<RideCompletedPage />} />
            <Route path="/history" element={<RideHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>

      <MobileNav />
    </div>
  );
};

export const App: React.FC = () => {
  const [isDemoHubOpen, setIsDemoHubOpen] = useState(false);

  return (
    <RideProvider>
      <BrowserRouter>
        <AnimatedRoutes onOpenDemoHub={() => setIsDemoHubOpen(true)} />
        <DemoHubModal isOpen={isDemoHubOpen} onClose={() => setIsDemoHubOpen(false)} />
      </BrowserRouter>
    </RideProvider>
  );
};

export default App;
