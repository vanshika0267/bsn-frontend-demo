import { useApp } from '../context/AppContext';
import { ROLE_META } from '../utils/roleDetection';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, githubUsername } = useApp();
  const roleMeta = user?.role ? ROLE_META[user.role] : null;

  return (
    <div className="space-y-7 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[30px] tracking-tight text-[--color-secondary-navy]">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 text-[14px] mt-1">
            {roleMeta?.description}
          </p>
        </div>
        <Link to="/profile" className="text-[13px] px-4 py-2 rounded-xl border border-[--color-border-gray] bg-white hover:bg-slate-50">
          Edit profile →
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-[--color-border-gray] p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[22px]">{roleMeta?.icon}</span>
            <div>
              <div className="font-display font-semibold text-[--color-secondary-navy]">
                {roleMeta?.label} Workspace
              </div>
              <div className="text-[12px] text-slate-500">{user?.email}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { k: '12', l: 'Active projects', c: 'text-[--color-primary-blue]' },
              { k: '4', l: 'Mentor connects', c: 'text-[--color-success-green]' },
              { k: githubUsername ? '✓' : '—', l: 'GitHub linked', c: 'text-[--color-secondary-navy]' },
            ].map((s,i)=>(
              <div key={i} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[--color-border-gray]">
                <div className={`text-[24px] font-display font-semibold ${s.c}`}>{s.k}</div>
                <div className="text-[12px] text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-[13px]">
            <Link to="/profile" className="px-4 py-2 rounded-xl bg-[--color-primary-blue] text-white font-[500] hover:bg-[--color-primary-blue-hover]">Complete profile</Link>
            <Link to="/community" className="px-4 py-2 rounded-xl border border-[--color-border-gray] hover:bg-slate-50">Find mentors</Link>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-[--color-border-gray] p-6 shadow-sm">
          <h3 className="font-display font-semibold mb-3 text-[--color-secondary-navy]">Quick actions</h3>
          <div className="space-y-2 text-[13px]">
            <Link to="/profile" className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[--color-border-gray]">→ Connect GitHub</Link>
            <Link to="/profile" className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[--color-border-gray]">→ Update skills</Link>
            <Link to="/community" className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[--color-border-gray]">→ Browse chatrooms</Link>
            <Link to="/dashboard" className="block px-3 py-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-[--color-border-gray]">→ View opportunities</Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[--color-border-gray] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-semibold text-[--color-secondary-navy]">GitHub Integration</h3>
          <Link to="/profile" className="text-[13px] text-[--color-primary-blue] hover:underline">Manage →</Link>
        </div>
        {githubUsername ? (
          <div className="text-[14px] text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Connected as <b>@{githubUsername}</b> • repositories sync automatically
          </div>
        ) : (
          <div className="text-[14px] text-slate-500">
            Connect your GitHub in Profile to showcase repositories automatically.
          </div>
        )}
      </div>
    </div>
  );
}
