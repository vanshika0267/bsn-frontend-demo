import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[--color-light-gray]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children || <Outlet />}
      </main>
      <footer className="border-t border-[--color-border-gray] bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-[12px] text-slate-500 flex flex-wrap gap-3 justify-between">
          <span>© {new Date().getFullYear()} BioPay Student Network</span>
          <span className="flex gap-5">
            <a className="hover:text-slate-800" href="#">Privacy</a>
            <a className="hover:text-slate-800" href="#">Terms</a>
            <a className="hover:text-slate-800" href="#">Support</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
