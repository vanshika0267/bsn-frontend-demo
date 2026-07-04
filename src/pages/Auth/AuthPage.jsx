import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { detectRoleFromEmail } from '../../utils/roleDetection';
import Login3DBackground from '../../components/auth/Login3DBackground';
import RoleBadge from '../../components/auth/RoleBadge';
import { FiUser, FiMail, FiLock, FiBookOpen, FiUserCheck, FiArrowRight } from 'react-icons/fi';

const validatePassword = (pw) => {
  return {
    minLength: pw.length >= 8,
    hasUpper: /[A-Z]/.test(pw),
    hasLower: /[a-z]/.test(pw),
    hasNumber: /[0-9]/.test(pw),
    hasSpecial: /[^A-Za-z0-9]/.test(pw)
  };
};

const PasswordChecklist = ({ password }) => {
  const checks = validatePassword(password);

  const items = [
    { label: 'Minimum 8 characters', met: checks.minLength },
    { label: 'At least one uppercase letter (A-Z)', met: checks.hasUpper },
    { label: 'At least one lowercase letter (a-z)', met: checks.hasLower },
    { label: 'At least one number (0-9)', met: checks.hasNumber },
    { label: 'At least one special character', met: checks.hasSpecial },
  ];

  return (
    <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 text-xs text-left">
      <p className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-1">Password Requirements</p>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
            item.met ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'
          }`}>
            {item.met ? '✓' : '•'}
          </span>
          <span className={item.met ? 'text-green-400 font-semibold' : 'text-slate-400'}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AuthPage({ initialMode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useApp();

  const urlMode = location.pathname.includes('signup') || location.pathname.includes('register') ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode || urlMode);

  useEffect(() => {
    // Only automatically switch mode based on URL if we are not in forgot password mode
    if (mode !== 'forgot') {
      setMode(urlMode);
    }
  }, [urlMode]);

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [terms, setTerms] = useState(false);

  // Register-only fields
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
  const [errors, setErrors] = useState({});

  // Role detection
  const { role: detectedRole } = useMemo(() => detectRoleFromEmail(email), [email]);

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    if (m === 'forgot') return;
    navigate(m === 'register' ? '/signup' : '/login', { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!email || !password) {
      setErrors({ global: 'Email and password are required' });
      return;
    }
    setLoading(true);
    try {
      const resultRole = await login(email, password);
      // Mock or real role redirection
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrors({ global: err.message || 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Full name is required';
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Please enter a valid email address';
    
    if (!password) {
      tempErrors.password = 'Password is required';
    } else {
      const checks = validatePassword(password);
      if (!Object.values(checks).every(Boolean)) {
        tempErrors.password = 'Password does not meet all complexity requirements';
      }
    }
    
    if (password !== confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';
    if (!terms) tempErrors.terms = 'You must accept the Terms of Service';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setLoading(true);
    try {
      const roleToUse = detectedRole || 'student';
      const collegeName = university || institution || 'BioPay University';
      await register({
        name,
        email,
        password,
        role: roleToUse,
        college: collegeName,
        university: collegeName,
        graduationYear,
        major,
        department,
        institution: collegeName,
        designation,
        company,
        position,
        industry,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrors({ global: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const tempErrors = {};
    if (!email) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = 'Please enter a valid email address';
    
    if (!password) {
      tempErrors.password = 'Password is required';
    } else {
      const checks = validatePassword(password);
      if (!Object.values(checks).every(Boolean)) {
        tempErrors.password = 'Password does not meet all complexity requirements';
      }
    }
    
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Show success feedback
      setErrors({ success: 'Password has been reset successfully! You can now log in.' });
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setMode('login');
        setErrors({});
      }, 3000);
    } catch (err) {
      setErrors({ global: 'Password reset failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    // Autofill with the mock student persona
    login('alex.rivera@university.edu', 'secret123')
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => setErrors({ global: 'OAuth simulation failed' }))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col lg:flex-row relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Login3DBackground />
      </div>

      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Left Column: Brand & Hero */}
      <div className="relative w-full lg:w-[54%] xl:w-[56%] min-h-[380px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-16 z-10 order-1">
        {/* Header Logo */}
        <header className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-display text-[19px] font-bold shadow-[0_4px_24px_rgba(37,99,235,0.45)] ring-1 ring-white/20 transition-transform group-hover:scale-105">
              B
            </div>
            <div>
              <div className="text-[20px] font-display font-semibold tracking-tight text-white leading-tight">BioPay</div>
              <div className="text-slate-400 text-[12px] font-normal">Student Network</div>
            </div>
          </Link>
        </header>

        {/* Hero content */}
        <main className="relative z-10 my-auto py-10 lg:py-16 max-w-[540px] text-left">
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

          {/* Premium trust metrics */}
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

        {/* Footer info */}
        <footer className="relative z-10 hidden sm:flex items-center gap-6 text-[12px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">🔒 SOC2 Compliant Auth</span>
          <span className="flex items-center gap-1.5">⚡ SSO & Role Routing</span>
          <span className="flex items-center gap-1.5">🌐 biopay.edu</span>
        </footer>
      </div>

      {/* Right Column: Glassmorphic form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 z-10 order-2 relative">
        <div className="relative z-10 w-full max-w-[460px] bg-[#0A101D]/75 sm:bg-white/[0.045] backdrop-blur-2xl border border-white/12 rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.65)] p-6 sm:p-9 transition-all duration-300 text-left">
          
          {/* Segmented Tab Bar */}
          {mode !== 'forgot' && (
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
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-gradient-to-r from-blue-600/90 to-indigo-600/90 border border-blue-400/30 shadow-[0_2px_12px_rgba(37,99,235,0.35)] transition-all duration-300 ease-out ${
                  mode === 'login' ? 'left-1.5' : 'left-[calc(50%+3px)]'
                }`}
              />
            </div>
          )}

          {/* Form Header */}
          <div className="mb-6">
            <h2 className="font-display text-[24px] sm:text-[26px] font-semibold text-white tracking-tight">
              {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create an account' : 'Reset password'}
            </h2>
            <p className="text-slate-400 text-[13px] sm:text-[14px] mt-1 leading-relaxed">
              {mode === 'login'
                ? 'Enter your institutional credentials to access your workspace'
                : mode === 'register'
                ? 'Join the BioPay Student Network in less than 60 seconds'
                : 'Enter your institutional email and set a new secure password'}
            </p>
          </div>

          {/* Form Content */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <FiMail size={16} />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@student.biopay.edu"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="login-password" className="block text-[13px] font-medium text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-[12px] text-blue-400 hover:text-blue-300 transition-colors font-medium bg-transparent border-none cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <FiLock size={16} />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
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

              {errors.global && (
                <div className="text-[13px] text-red-300 bg-red-950/50 border border-red-500/30 px-4 py-3 rounded-xl">
                  {errors.global}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-medium text-white text-[14px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : mode === 'register' ? (
            /* REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-4 max-h-[58vh] overflow-y-auto pr-1">
              <div>
                <label htmlFor="reg-email" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                  Institutional Email *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <FiMail size={16} />
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@student.biopay.edu"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-black/35 border ${
                      errors.email ? 'border-red-500' : 'border-white/12'
                    } text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    required
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Dynamic Role Badge component */}
              <RoleBadge email={email} />

              <div>
                <label htmlFor="reg-name" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <FiUser size={16} />
                  </span>
                  <input
                    id="reg-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-black/35 border ${
                      errors.name ? 'border-red-500' : 'border-white/12'
                    } text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    required
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-password" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <FiLock size={16} />
                    </span>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars"
                      className={`w-full pl-10 pr-11 py-3 rounded-xl bg-black/35 border ${
                        errors.password ? 'border-red-500' : 'border-white/12'
                      } text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
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
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="reg-confirm-password" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <FiLock size={16} />
                    </span>
                    <input
                      id="reg-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-11 py-3 rounded-xl bg-black/35 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-white/12'
                      } text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
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
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Password dynamic validation checklist */}
              {password && <PasswordChecklist password={password} />}

              {/* Conditional Role-Specific Fields */}
              {detectedRole && detectedRole !== 'admin' && (
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                    Additional Profile Details <span className="text-slate-500 font-normal capitalize">(Optional)</span>
                  </div>
                  
                  {detectedRole === 'student' && (
                    <div className="space-y-2.5">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <FiBookOpen size={16} />
                        </span>
                        <input
                          placeholder="University / College Name"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          placeholder="Graduation Year"
                          value={graduationYear}
                          onChange={(e) => setGraduationYear(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-blue-500"
                        />
                        <input
                          placeholder="Major / Specialization"
                          value={major}
                          onChange={(e) => setMajor(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {detectedRole === 'faculty' && (
                    <div className="space-y-2.5">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                          <FiBookOpen size={16} />
                        </span>
                        <input
                          placeholder="Institution Name"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          placeholder="Department"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-blue-500"
                        />
                        <input
                          placeholder="Designation"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {detectedRole === 'recruiter' && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2.5">
                        <input
                          placeholder="Company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-blue-500"
                        />
                        <input
                          placeholder="Position"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <input
                        placeholder="Industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/35 border border-white/12 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-start gap-2 pt-1">
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  className="mt-1 rounded border-white/12 bg-black/35 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="reg-terms" className="text-slate-400 text-xs leading-normal">
                  I agree to the Terms of Service & Privacy Policy *
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-xs">{errors.terms}</p>}

              {errors.global && (
                <div className="text-[13px] text-red-300 bg-red-950/50 border border-red-500/30 px-4 py-3 rounded-xl">
                  {errors.global}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-medium text-white text-[14px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? 'Registering...' : 'Register Account'}
              </button>
            </form>
          ) : (
            /* FORGOT / RESET PASSWORD FORM */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <FiMail size={16} />
                  </span>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@student.biopay.edu"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-black/35 border ${
                      errors.email ? 'border-red-500' : 'border-white/12'
                    } text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    required
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="forgot-password" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                  New Password *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <FiLock size={16} />
                  </span>
                  <input
                    id="forgot-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl bg-black/35 border ${
                      errors.password ? 'border-red-500' : 'border-white/12'
                    } text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
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
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                
                {/* Dynamic Checklist */}
                {password && <PasswordChecklist password={password} />}
              </div>

              <div>
                <label htmlFor="forgot-confirm-password" className="block text-[13px] font-medium text-slate-300 mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <FiLock size={16} />
                  </span>
                  <input
                    id="forgot-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl bg-black/35 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-white/12'
                    } text-white placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
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
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {errors.success && (
                <div className="text-[13px] text-green-300 bg-green-950/50 border border-green-500/30 px-4 py-3 rounded-xl">
                  {errors.success}
                </div>
              )}

              {errors.global && (
                <div className="text-[13px] text-red-300 bg-red-950/50 border border-red-500/30 px-4 py-3 rounded-xl">
                  {errors.global}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-medium text-white text-[14px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[13px] text-blue-400 hover:text-blue-300 transition-colors font-medium bg-transparent border-none cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Social login separator */}
          <div className="relative flex items-center justify-center my-5">
            <div className="absolute inset-x-0 h-[1px] bg-white/10"></div>
            <span className="relative px-3 text-[10px] uppercase font-bold text-slate-500 bg-[#0B1220] tracking-wider">
              Or connect with
            </span>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-3 text-sm font-semibold text-white transition-colors focus:outline-none"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.484 0-6.29-2.905-6.29-6.514 0-3.61 2.806-6.515 6.29-6.515 1.5 0 2.87.525 3.96 1.485l3.15-3.15C18.17 1.05 15.345 0 12.24 0 5.865 0 .685 5.25.685 12c0 6.75 5.18 12 11.555 12 6.51 0 11.235-4.47 11.235-11.22 0-.705-.075-1.395-.195-2.07H12.24z"
              />
            </svg>
            Google OAuth
          </button>

          <div className="text-center text-[12px] text-slate-500 mt-6">
            © {new Date().getFullYear()} BioPay Student Network • v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
