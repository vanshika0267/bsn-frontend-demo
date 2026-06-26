import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiGrid, FiBriefcase, FiUser, FiBell, FiSettings } from 'react-icons/fi';

const BottomNav = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentTab = queryParams.get('tab') || 'overview';

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: FiGrid, isTab: false },
    { name: 'Opportunities', path: '/dashboard?tab=opportunities', icon: FiBriefcase, isTab: true, tabName: 'opportunities' },
    { name: 'Profile', path: '/profile', icon: FiUser, isTab: false },
    { name: 'Inbox', path: '/notifications', icon: FiBell, isTab: false },
    { name: 'Settings', path: '/settings', icon: FiSettings, isTab: false }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-45 bg-white border-t border-outline-variant px-4 py-2 flex items-center justify-around lg:hidden shadow-lg">
      {navItems.map((item, idx) => {
        let isActive = false;
        
        if (item.isTab) {
          isActive = location.pathname === '/dashboard' && currentTab === item.tabName;
        } else {
          // If accessing dashboard, ensure tab is overview/none
          if (item.path === '/dashboard') {
            isActive = location.pathname === '/dashboard' && currentTab === 'overview';
          } else {
            isActive = location.pathname === item.path;
          }
        }

        const Icon = item.icon;

        return (
          <NavLink
            key={idx}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-colors min-w-[64px] ${
              isActive 
                ? 'text-primary font-bold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon size={20} className={isActive ? 'text-primary scale-110' : 'text-on-surface-variant'} />
            <span className="text-[10px] tracking-wide">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomNav;
