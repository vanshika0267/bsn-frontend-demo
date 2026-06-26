import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiUser, FiBookOpen, FiAward, FiBriefcase, 
  FiCompass, FiUsers, FiBell, FiSettings, FiX 
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useRole } from '../../context/RoleContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { userRole, setUserRole, updateProfile } = useApp();
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

  const roles = ['Student', 'Senior/Alumni', 'Recruiter', 'College Admin', 'Platform Admin'];

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

        {/* Sidebar Footer / Role Switcher */}
        <div className="px-4 pt-4 border-t border-outline-variant">
          <div className="p-3 bg-surface-container rounded-lg border border-outline-variant">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Active Persona</span>
            <select
              value={userRole}
              onChange={(e) => {
                const newRole = e.target.value;
                setUserRole(newRole);
                updateProfile({ role: newRole });
                
                // If shifting to Admin role, automatically route to the Admin panel
                if (newRole === 'College Admin' || newRole === 'Platform Admin') {
                  navigate('/dashboard?tab=admin');
                } else if (currentTab === 'admin') {
                  // Switch away from Admin tab when active role changes
                  navigate('/dashboard?tab=overview');
                }
              }}
              className="w-full bg-white border border-outline-variant rounded-lg text-xs font-semibold text-on-surface px-2 py-1.5 focus:outline-none focus:border-primary cursor-pointer"
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
