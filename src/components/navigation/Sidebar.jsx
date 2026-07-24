import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiUser, FiBookOpen, FiAward, FiBriefcase, 
  FiCompass, FiUsers, FiBell, FiSettings, FiX 
} from 'react-icons/fi';
import { useRole } from '../../context/RoleContext';
import { useApp } from '../../context/AppContext';
import Avatar from '../common/Avatar';

const Sidebar = ({ isOpen, onClose }) => {
  const { sidebarItems } = useRole();
  const { user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Get current active tab if on dashboard
  const queryParams = new URLSearchParams(location.search);
  const currentTab = queryParams.get('tab') || 'overview';

  const menuItems = sidebarItems;

  const handleNavClick = (item) => {
    if (onClose) onClose();
    navigate(item.path);
  };

  const handleProfileClick = () => {
    if (onClose) onClose();
    navigate('/profile');
  };

  return (
    <>
      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-30 w-64 bg-white border-r border-outline-variant pt-16 pb-5 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button on Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-on-surface-variant hover:text-on-surface lg:hidden"
        >
          <FiX size={20} />
        </button>

        {/* User Avatar / Mini Profile */}
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 px-4 py-3 mx-2 mb-2 rounded-lg hover:bg-surface-container transition-colors text-left"
          title="Go to Profile"
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden ring-2 ring-primary/20 shrink-0">
            <Avatar src={user.profilePicture} alt={user.name} className="w-full h-full" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-on-surface leading-tight truncate">{user.name}</p>
            <p className="text-[10px] text-on-surface-variant truncate">{user.role || 'Student'}</p>
          </div>
        </button>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map((item, idx) => {
            const isActive = item.tab
              ? (location.pathname === '/dashboard' && currentTab === item.tab)
              : (location.pathname === item.path || (item.path === '/profile' && location.pathname.startsWith('/profile')));

            const Icon = item.icon;

            return (
              <button
                key={idx}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-r-lg text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#eff6ff] text-[#1e40af] border-l-4 border-primary pl-2.5' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-l-4 border-transparent'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#1e40af]' : 'text-on-surface-variant'} />
                {item.name}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;