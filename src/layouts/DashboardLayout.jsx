import React, { useState } from 'react';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';
import BottomNav from '../components/navigation/BottomNav';
import { useApp } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { isAuthenticated } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected Route Check for Prototype
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex-1 flex relative">
        {/* Navigation Sidebar (fixed on desktop, slide drawer on mobile) */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Scrollable Main Content Frame */}
        <main className="flex-1 min-w-0 lg:pl-64 flex flex-col pb-20 lg:pb-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile-only Bottom Navigation Tab bar */}
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
