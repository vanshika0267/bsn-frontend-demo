import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiSearch, FiLogOut, FiUser, FiSettings, FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, notifications, searchQuery, setSearchQuery, settings, updateSettings } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-outline-variant px-4 py-3 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-on-surface lg:hidden focus:outline-none"
        >
          <FiMenu size={20} />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="font-poppins font-extrabold text-white text-lg tracking-wider">B</span>
          </div>
          <span className="font-poppins font-bold text-xl tracking-tight text-on-surface hidden sm:block">
            BSN <span className="text-primary text-xs font-semibold px-1.5 py-0.5 rounded bg-primary/10 ml-1">STUDENT</span>
          </span>
        </Link>
      </div>

      {/* Middle: Search bar */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-on-surface-variant/75 pointer-events-none">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search resources, students, opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm font-sans bsn-input"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search Toggle for Mobile */}
        <button className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-on-surface md:hidden transition-colors">
          <FiSearch size={20} />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={() => updateSettings('darkMode', !settings.darkMode)}
          className="p-2.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-on-surface transition-colors"
          title={settings.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle dark mode"
          id="dark-mode-toggle"
        >
          {settings?.darkMode ? <FiSun size={20} className="text-amber-400 animate-spin-slow" /> : <FiMoon size={20} />}
        </button>

        {/* Notifications Icon */}
        <Link to="/notifications" className="relative p-2.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-on-surface transition-colors">
          <FiBell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error border border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 focus:outline-none p-1 rounded-lg hover:bg-surface-container transition-colors"
          >
            <img 
              src={user.profilePicture} 
              alt={user.name} 
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-primary/20"
            />
            <div className="text-left hidden lg:block pr-1">
              <p className="text-xs font-semibold text-on-surface leading-tight">{user.name}</p>
              <p className="text-[10px] text-on-surface-variant">Score: {user.impactScore}</p>
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-xl border border-outline-variant py-2 z-20"
                >
                  <div className="px-4 py-2 border-b border-outline-variant">
                    <p className="text-sm font-semibold text-on-surface">{user.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                  </div>
                  
                  <div className="p-1">
                    <Link 
                      to="/profile" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                    >
                      <FiUser size={16} className="text-primary" />
                      My Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                    >
                      <FiSettings size={16} className="text-primary" />
                      Settings
                    </Link>
                  </div>

                  <div className="border-t border-outline-variant mt-1 p-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <FiLogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
