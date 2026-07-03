import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { detectRoleFromEmail, ROLE_META } from '../utils/roleDetection';
import Login3DBackground from '../components/auth/Login3DBackground';
import type { RegisterData } from '../types';

type Mode = 'login' | 'register';

export default function AuthPage({ initialMode }: { initialMode?: Mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useApp();

  // Derive mode from URL or prop
  const urlMode: Mode = location.pathname.includes('register') ? 'register' : 'login';
  const [mode, setMode] = useState<Mode>(initialMode || urlMode);

  useEffect(() => {
    setMode(urlMode);
  }, [urlMode]);

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register-only fields
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [major, setMajor] = useState('');
  const [department, setDepartment] = useState('');
  const [institution, setInstitution] = useState('');
  const [designation, setDesignation] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [industry, setIndustry] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Silent detection for registration payload (no UI messages displayed)
  const detectedRole = useMemo(() => detectRoleFromEmail(email).role, [email]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError('');
    navigate(m === 'register' ? '/register' : '/login', { replace: true });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      const redirect = result.role && ROLE_META[result.role] ? ROLE_META[result.role].dashboard : '/dashboard';
      navigate(redirect, { replace: true });
    } catch {
      setError('Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
      setError('Fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const roleToUse = detectedRole || 'student';
      const data: RegisterData = {
        name,
        email,
        password,
        role: roleToUse,
        university,
        graduationYear,
        major,
        department,
        institution,
        designation,
        company,
        position,
        industry,
      };
      const ok = await register(data);
      if (ok) {
        const redirect = roleToUse && ROLE_META[roleToUse] ? ROLE_META[roleToUse].dashboard : '/dashboard';
        navigate(redirect, { replace: true });
      }
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* 3D Animation Background spanning across BOTH Left Hero and Right Login/Register section */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Login3DBackground />
      </div>

      {/* Cosmic Ambient Background Glows across the whole page */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Left Hero Section */}
      <div className="relative w-full lg:w-[54%] xl:w-[56%] min-h-[380px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 z-10 order-1">
        {/* Brand Header */}
        <header className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-display text-[19px] font-bold shadow-[0_4px_24px_rgba(37,99,235,0.45)] ring-1 ring-white/20">
              B
            </div>
            <div>
              <div className="text-[20px] font-display font-semibold tracking-tight text-white leading-tight">BioPay</div>
              <div className="text-slate-400 text-[12px] font-normal">Student Network</div>
            </div>
          </div>
        </header>

        {/* Re-balanced Hero Content */}
        <main className="relative z-10 my-auto py-10 lg:py-16 max-w-[540px]">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-[12px] font-medium text-sky-300 mb-6 backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            Next-Gen Campus Identity & Sync
          </div>
          <h1 className="font-display text-[36px] sm:text-[46px] xl:text-[52px] leading-[1.08] font-bold tracking-tight text-white">
            One campus identity.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
              Every opportunity.
            </span>
          </h1>
          <p className="text-slate-300/90 text-[15px] sm:text-[16px] leading-relaxed mt-5 max-w-[460px]">
            Unified institutional authentication and real-time GitHub portfolio synchronization built for modern academic ecosystems.
          </p>

          {/* Premium trust metrics replacing removed role cards */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 sm:gap-6 max-w-[460px]">
            <div>
              <div className="text-[20px] sm:text-[22px] font-display font-semibold text-white tracking-tight">SSO Ready</div>
              <div className="text-[12px] text-slate-400 mt-0.5">Institutional routing</div>
            </div>
            <div>
              <div className="text-[20px] sm:text-[22px] font-display font-semibold text-white tracking-tight">Live Sync</div>
              <div className="text-[12px] text-slate-400 mt-0.5">GitHub REST API</div>
            </div>
            <div>
              <div className="text-[20px] sm:text-[22px] font-display font-semibold text-white tracking-tight">256-Bit</div>
              <div className="text-[12px] text-slate-400 mt-0.5">End-to-end secure</div>
            </div>
          </div>
        </main>

        {/* Bottom Meta */}
        <footer className="relative z-10 hidden sm:flex items-center gap-6 text-[12px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">🔒 SOC2 Compliant Auth</span>
          <span className="flex items-center gap-1.5">⚡ SSO & Role Routing</span>
          <span className="flex items-center gap-1.5">🌐 biopay.edu</span>
        </footer>
      </div>

      {/* Right Auth Card Section */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 z-10 order-2 relative">
        {/* Glassmorphism Auth Card floating transparently over the 3D background */}
        <div className="relative z-10 w-full max-w-[440px] bg-[#0A101D]/75 sm:bg-white/[0.045] backdrop-blur-2xl border border-white/12 rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.65),0_0_40px_rgba(37,99,235,0.12)] p-6 sm:p-9 transition-all duration-300">
          {/* Segmented Tab Bar */}
          <div className="relative flex bg-black/45 p-1.5 rounded-2xl border border-white/10 mb-7 backdrop-blur-md">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`relative z-10 flex-1 py-2.5 text-center text-[13px] sm:text-[14px] font-medium transition-colors duration-200 rounded-xl ${
                mode === 'login' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`relative z-10 flex-1 py-2.5 text-center text-[13px] sm:text-[14px] font-medium transition-colors duration-200 rounded-xl ${
                mode === 'register' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register
            </button>
            {/* Animated indicator */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-gradient-to-r from-blue-600/90 to-indigo-600/90 border border-blue-400/30 shadow-[0_2px_12px_rgba(37,99,235,0.35)] transition-all duration-300 ease-out ${
                mode === 'login' ? 'left-1.5' : 'left-[calc(50%+3px)]'
              }`}
            />
          </div>

          {/* Card Header */}
          <div className="mb-6">
            <h2 className="font-display text-[24px] sm:text-[26px] font-semibold text-white tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-400 text-[13px] sm:text-[14px] mt-1 leading-relaxed">
              {mode === 'login'
                ? 'Enter your institutional credentials to access your workspace'
                : 'Join the BioPay Student Network in less than 60 seconds'}
            </p>
          </div>

          {/* Form Content */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@student.biopay.edu"
                  className="w-full px-4 py-3 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="login-password" className="block text-[13px] font-medium text-slate-300">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={e => e.preventDefault()}
                    className="text-[12px] text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors rounded-lg"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.8 21.8 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.77 21.77 0 0 1-3.16 4.19M1 1l22 22M9.53 9.53a3 0 0 0 4.24 4.24" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-[13px] text-red-300 bg-red-950/50 border border-red-500/30 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-medium text-white text-[14px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.5)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4 max-h-[62vh] lg:max-h-[520px] overflow-y-auto pr-1">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="reg-email" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                    Institutional Email *
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@student.biopay.edu"
                    className="w-full px-4 py-3 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reg-name" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="reg-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 8 chars"
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(s => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
                    >
                      {showPassword ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.8 21.8 0 0 1 5.06-5.94M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional details without role detection messages */}
              {detectedRole && detectedRole !== 'admin' && (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="text-[12px] font-medium text-slate-400">
                    Additional Profile Details <span className="text-slate-500 font-normal">(Optional)</span>
                  </div>
                  {detectedRole === 'student' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[13px]">
                      <input
                        placeholder="University"
                        value={university}
                        onChange={e => setUniversity(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      <input
                        placeholder="Grad Year"
                        value={graduationYear}
                        onChange={e => setGraduationYear(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      <input
                        placeholder="Major"
                        value={major}
                        onChange={e => setMajor(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  )}
                  {detectedRole === 'faculty' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[13px]">
                      <input
                        placeholder="Department"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      <input
                        placeholder="Institution"
                        value={institution}
                        onChange={e => setInstitution(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      <input
                        placeholder="Designation"
                        value={designation}
                        onChange={e => setDesignation(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  )}
                  {detectedRole === 'recruiter' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[13px]">
                      <input
                        placeholder="Company"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      <input
                        placeholder="Position"
                        value={position}
                        onChange={e => setPosition(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      <input
                        placeholder="Industry"
                        value={industry}
                        onChange={e => setIndustry(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="text-[13px] text-red-300 bg-red-950/50 border border-red-500/30 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl font-medium text-white text-[14px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.5)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="text-center text-[12px] text-slate-500 mt-6">
            © {new Date().getFullYear()} BioPay Student Network • v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
