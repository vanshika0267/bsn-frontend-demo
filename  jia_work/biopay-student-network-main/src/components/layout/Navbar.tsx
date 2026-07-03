import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ROLE_META } from '../../utils/roleDetection';

export default function Navbar() {
  const { user, logout, githubUsername } = useApp();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
    { to: '/community', label: 'Community' },
  ];

  const roleMeta = user?.role ? ROLE_META[user.role] : null;

  return (
    <header className="bg-white/90 backdrop-blur border-b border-[--color-border-gray] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[12px] bg-[--color-primary-blue] flex items-center justify-center text-white font-display font-bold shadow-[0_4px_16px_rgba(37,99,235,.28)]">
                B
              </div>
              <div className="leading-tight">
                <div className="font-display font-semibold text-[--color-secondary-navy]">BioPay</div>
                <div className="text-[11px] text-slate-500 -mt-0.5">Student Network</div>
              </div>
            </Link>
            <nav className="hidden md:flex gap-7">
              {navItems.map(item => {
                const active = location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`text-[14px] font-[450] transition-colors ${
                      active ? 'text-[--color-primary-blue]' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {githubUsername && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-full bg-slate-900 text-white">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
                {githubUsername}
              </div>
            )}
            {roleMeta && (
              <span
                className="hidden sm:inline-flex text-[11px] font-medium px-2.5 py-1.5 rounded-full"
                style={{ backgroundColor: roleMeta.bg, color: roleMeta.color }}
              >
                {roleMeta.icon} {roleMeta.label}
              </span>
            )}
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-9 h-9 rounded-full ring-1 ring-slate-200 object-cover bg-slate-100"
              />
              <div className="hidden sm:block text-right leading-tight">
                <div className="text-[13px] font-[500] text-[--color-secondary-navy]">{user?.name}</div>
                <div className="text-[11px] text-slate-500">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-[13px] text-slate-500 hover:text-[--color-danger-red] px-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
