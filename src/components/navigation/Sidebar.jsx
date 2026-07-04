import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiUser, FiBookOpen, FiAward, FiBriefcase, 
  FiCompass, FiUsers, FiBell, FiSettings, FiX 
} from 'react-icons/fi';
import { useRole } from '../../context/RoleContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { sidebarItems } = useRole();
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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#0f172a]/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-outline-variant pt-20 lg:pt-5 pb-5 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
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

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map((item, idx) => {
            // Determine active state based on route path and queries
            let isActive = false;
            if (item.tab) {
              isActive = location.pathname === '/dashboard' && currentTab === item.tab;
            } else {
              isActive = location.pathname === item.path;
            }

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
