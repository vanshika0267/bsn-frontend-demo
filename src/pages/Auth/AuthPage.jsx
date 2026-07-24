import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { detectRoleFromEmail, ROLE_META } from '../../utils/roleDetection';
import Login3DBackground from '../../components/auth/Login3DBackground';
import logo from '../../assets/logo.png';
import { FiSun, FiMoon, FiCheck, FiArrowLeft, FiShield, FiClock } from 'react-icons/fi';
import { sendRegistrationOTP, verifyRegistrationOTP, resendRegistrationOTP } from '../../services/api';

const isRecognisedCollege = (name) => {
  if (!name) return false;
  const lower = name.toLowerCase().trim();
  const keywords = ['university', 'institute', 'college', 'iit', 'mit', 'stanford', 'harvard', 'caltech', 'berkeley', 'oxford', 'tsinghua', 'upes'];
  return keywords.some(k => lower.includes(k));
};

const isGraduationYearInPast = (endYearStr) => {
  if (!endYearStr) return false;
  const cleaned = endYearStr.trim().toLowerCase();
  const parsedTime = Date.parse(cleaned);
  const now = new Date(2026, 6, 23); // Current date is July 23, 2026 (Month is 0-indexed, so 6 is July)
  if (!isNaN(parsedTime)) {
    return new Date(parsedTime) < now;
  }
  const yearMatch = cleaned.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0], 10);
    if (year < 2026) return true;
    if (year > 2026) return false;
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let monthIdx = -1;
    for (let i = 0; i < months.length; i++) {
      if (cleaned.includes(months[i])) {
        monthIdx = i;
        break;
      }
    }
    if (monthIdx !== -1) {
      return monthIdx < 6;
    }
  }
  return false;
};

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
    <div className="mt-2.5 p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 space-y-1.5 text-xs text-left">
      <p className="font-bold text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Password Requirements</p>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
            item.met 
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
              : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
          }`}>
            {item.met ? '✓' : '•'}
          </span>
          <span className={item.met ? 'text-emerald-650 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}>
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
  const { login, register, settings, updateSettings, setUserRole, updateProfile } = useApp();

  // Derive mode from URL
  const urlMode = location.pathname.includes('register') || location.pathname.includes('signup') ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode || urlMode);

  // Registration step state
  const [registerStep, setRegisterStep] = useState(1);
  const [detectedRoleForRegister, setDetectedRoleForRegister] = useState(null);

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Register Step 1 fields
  const [name, setName] = useState('');

  // Frontend Email OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Register Step 2 — role-specific fields
  const [collegeName, setCollegeName] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [terms, setTerms] = useState(false);
  const [isAlumni, setIsAlumni] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mentorship/Alumni registration options
  const [registerAsAlumni, setRegisterAsAlumni] = useState(false);
  const [registerAsSenior, setRegisterAsSenior] = useState(false);

  // Resend Cooldown Timer Effect (60 seconds)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const resetFormFields = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setName('');
    setCollegeName('');
    setStartYear('');
    setEndYear('');
    setInstitutionName('');
    setCompanyName('');
    setTerms(false);
    setError('');
    setLoading(false);
    setRegisterAsAlumni(false);
    setRegisterAsSenior(false);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpInput('');
    setOtpLoading(false);
    setOtpMessage('');
    setResendCooldown(0);
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (urlMode === 'register') {
      setMode('register');
      setRegisterStep(1);
      setDetectedRoleForRegister(null);
      resetFormFields();
    } else if (urlMode === 'login' && mode !== 'forgot') {
      setMode('login');
      setRegisterStep(1);
      setDetectedRoleForRegister(null);
      resetFormFields();
    }
  }, [urlMode]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const switchMode = (m) => {
    setMode(m);
    resetFormFields();
    setRegisterStep(1);
    setDetectedRoleForRegister(null);
    if (m === 'forgot') return;
    navigate(m === 'register' ? '/signup' : '/login', { replace: true });
  };

  // TODO: Integrate with backend API (POST /auth/send-registration-otp)
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setOtpMessage('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address first');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await sendRegistrationOTP(email);
      setOtpSent(true);
      setResendCooldown(60);
      setOtpInput('');
      setOtpMessage(res.message || `A verification code has been sent to ${email}.`);
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  // TODO: Integrate with backend API (POST /auth/verify-registration-otp)
  const handleVerifyOTP = async () => {
    setError('');
    setOtpMessage('');
    if (!otpInput || otpInput.trim().length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await verifyRegistrationOTP(email, otpInput);
      setOtpVerified(true);
      setOtpMessage(res.message || 'Email verified successfully!');
    } catch (err) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  // TODO: Integrate with backend API (POST /auth/resend-registration-otp)
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setOtpMessage('');
    setOtpLoading(true);
    try {
      const res = await resendRegistrationOTP(email);
      setOtpSent(true);
      setResendCooldown(60);
      setOtpInput('');
      setOtpMessage(res.message || `A new verification code has been sent to ${email}.`);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      // Case 2: Auto-detect graduated student on login
      const savedUserStr = localStorage.getItem('bsn_user');
      if (savedUserStr) {
        const loggedUser = JSON.parse(savedUserStr);
        const role = loggedUser.role || 'Student';
        if (role === 'Student' || role === 'Student + Senior') {
          const gradYear = loggedUser.endYear || loggedUser.graduationYear;
          if (gradYear && isGraduationYearInPast(gradYear)) {
            setUserRole('Senior/Alumni');
            updateProfile({ role: 'Senior/Alumni' });
          }
        }
      }
      // Redirection after successful login directly to the main BSN dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Register Step 1: Validate → check email verification → proceed to Step 2
  const handleRegisterContinue = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !name.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!otpVerified) {
      setError('Verify your email before registering.');
      return;
    }
    // Silent background role detection
    const detection = detectRoleFromEmail(email);
    setDetectedRoleForRegister((detection && detection.role) || 'student');
    setRegisterStep(2);
  };

  // Register Step 2: Validate role-specific fields → create account → redirect
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Password is required');
      return;
    }

    const checks = validatePassword(password);
    if (!Object.values(checks).every(Boolean)) {
      setError('Password does not meet all complexity requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!terms) {
      setError('You must agree to the Terms of Service & Privacy Policy');
      return;
    }

    const role = detectedRoleForRegister || 'student';

    if (role === 'student' && (!collegeName.trim() || !startYear.trim() || !endYear.trim())) {
      setError('Please fill in all fields');
      return;
    }
    if (role === 'faculty' && !institutionName.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (role === 'recruiter' && !companyName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Determine custom role locally based on graduation year and choices
    let determinedRole = 'Student';
    if (role === 'student') {
      if (isGraduationYearInPast(endYear.trim())) {
        determinedRole = 'Senior/Alumni';
      } else {
        determinedRole = registerAsSenior ? 'Student + Senior' : 'Student';
      }
    } else if (role === 'recruiter') {
      if (collegeName.trim() && isRecognisedCollege(collegeName.trim()) && registerAsAlumni) {
        determinedRole = 'Recruiter + Alumni';
      } else {
        determinedRole = 'Recruiter';
      }
    } else if (role === 'faculty') {
      determinedRole = 'Faculty';
    } else if (role === 'admin') {
      determinedRole = 'Platform Admin';
    }

    setLoading(true);
    try {
      const university = collegeName.trim() || institutionName.trim() || companyName.trim() || 'BioPay University';
      const data = {
        name: name.trim(),
        email,
        password,
        role: role,
        college: university,
        university: university,
        graduationYear: endYear.trim(),
        graduation_year: endYear.trim() ? Number(endYear.trim()) : undefined,
        is_alumni: isAlumni,
        startYear: startYear.trim(),
        endYear: endYear.trim(),
        institution: university,
        company: companyName.trim()
      };
      await register(data);
      
      // Override role locally to support our custom persona mapping
      setUserRole(determinedRole);
      updateProfile({ role: determinedRole });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!password) {
      setError('Password is required');
      return;
    }

    const checks = validatePassword(password);
    if (!Object.values(checks).every(Boolean)) {
      setError('Password does not meet all complexity requirements');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Show success feedback in error field by wrapping in success object
      setError({ success: 'Password has been reset successfully! You can now log in.' });
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setMode('login');
        setError('');
      }, 3000);
    } catch {
      setError('Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const getEyeIcon = (isVisible, toggleFunc) => (
    <button
      type="button"
      aria-label={isVisible ? 'Hide password' : 'Show password'}
      onClick={toggleFunc}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-lg cursor-pointer"
    >
      {isVisible ? (
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
  );

  const renderMessage = () => {
    if (!error) return null;
    if (typeof error === 'object' && error.props) {
      return (
        <div className="text-[13px] border px-4 py-3 rounded-xl text-red-700 bg-red-50/80 dark:text-red-300 dark:bg-red-950/50 border-red-200/60 dark:border-red-500/30">
          {error}
        </div>
      );
    }
    const isSuccess = typeof error === 'object' && error !== null && error.success;
    return (
      <div className={`text-[13px] border px-4 py-3 rounded-xl ${
        isSuccess
          ? 'text-emerald-700 bg-emerald-50/80 dark:text-emerald-300 dark:bg-emerald-950/50 border-emerald-200/60 dark:border-emerald-500/30'
          : 'text-red-700 bg-red-50/80 dark:text-red-300 dark:bg-red-950/50 border-red-200/60 dark:border-red-500/30'
      }`}>
        {isSuccess ? error.success : error}
      </div>
    );
  };

  const getRoleBadgeClasses = (role) => {
    switch (role) {
      case 'student':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/40';
      case 'faculty':
        return 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/40';
      case 'recruiter':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/40';
      case 'admin':
        return 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border-red-200/50 dark:border-red-800/40';
      default:
        return 'bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/40';
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl bsn-input placeholder:text-slate-400 dark:placeholder:text-slate-500 text-[13px] sm:text-[14px] transition-all duration-200";
  const labelClass = "block text-[12px] sm:text-[13px] font-semibold text-slate-700 dark:text-slate-350 mb-1 font-sans";
  const btnPrimaryClass = "w-full py-3 px-5 rounded-xl font-bold text-white text-[14px] bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] shadow-[0_4px_20px_rgba(37,99,235,0.15)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.25)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5";

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-background text-on-surface flex flex-col lg:flex-row relative overflow-x-hidden overflow-y-auto lg:overflow-hidden font-sans selection:bg-primary/20 bg-grid-pattern bg-noise text-left transition-colors duration-300">
      <Outlet />
      {/* 3D Animation Background spanning across BOTH Left Hero and Right Login/Register section */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <Login3DBackground isDark={settings?.darkMode} />
      </div>

      {/* Cosmic Ambient Background Glows across the whole page */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[110px] sm:blur-[140px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none z-0 animate-pulse-glow" />

      {/* Floating Theme Switch Toggle Button */}
      <div className="absolute top-5 right-5 z-50">
        <button
          type="button"
          onClick={() => updateSettings('darkMode', !settings.darkMode)}
          className="p-2 bg-white/40 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer backdrop-blur-md shadow-sm"
          title={settings.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle dark mode"
        >
          {settings.darkMode ? <FiSun size={15} className="text-amber-400" /> : <FiMoon size={15} />}
        </button>
      </div>

      {/* Left Hero Section */}
      <div className="relative w-full lg:w-[50%] xl:w-[52%] min-h-[300px] lg:h-full flex flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-12 z-10 order-1">
        {/* Brand Header */}
        <header className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="BioPay Student Network logo"
              className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-[0_4px_18px_rgba(37,99,235,0.45)]"
            />
            <div>
              <div className="text-[18px] sm:text-[20px] font-sans font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">BioPay</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-[12px] font-medium">Student Network</div>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <main className="relative z-10 my-auto py-4 lg:py-6 max-w-[500px]">
          <h1 className="font-poppins text-[30px] sm:text-[40px] xl:text-[46px] leading-[1.08] font-bold tracking-tight text-slate-900 dark:text-white">
            One campus identity.<br />
            <span className="bg-gradient-to-r from-[#10B981] to-[#34D399] bg-clip-text text-transparent block mt-1.5">
              Every opportunity.
            </span>
          </h1>
          <p className="text-slate-650 dark:text-slate-350 text-[14px] sm:text-[15px] leading-relaxed mt-4 max-w-[440px] font-sans font-medium">
            Build your verified academic identity, showcase real achievements, and unlock internships, opportunities, and recognition — all in one place.
          </p>

          <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 grid grid-cols-3 gap-3 sm:gap-5 max-w-[440px]">
            <div>
              <div className="text-[18px] sm:text-[20px] font-poppins font-bold text-slate-900 dark:text-white tracking-tight">Verified Identity</div>
              <div className="text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-450 mt-0.5 font-medium">College-confirmed profile</div>
            </div>
            <div>
              <div className="text-[18px] sm:text-[20px] font-poppins font-bold text-slate-900 dark:text-white tracking-tight">Merit Scoring</div>
              <div className="text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-450 mt-0.5 font-medium">Earn as you contribute</div>
            </div>
            <div>
              <div className="text-[18px] sm:text-[20px] font-poppins font-bold text-slate-900 dark:text-white tracking-tight">Opportunity Match</div>
              <div className="text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-450 mt-0.5 font-medium">Internships & more</div>
            </div>
          </div>
        </main>

        {/* Bottom Meta */}
        <footer className="relative z-10 hidden sm:flex items-center gap-5 text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5"><FiCheck className="text-emerald-500" /> Verified Student Profiles</span>
          <span className="flex items-center gap-1.5"><FiCheck className="text-emerald-500" /> Merit-Based Recognition</span>
          <span className="flex items-center gap-1.5"><FiCheck className="text-emerald-500" /> BSN by ConnectBioPay</span>
        </footer>
      </div>

      {/* Right Auth Card Section */}
      <div className="flex-1 lg:h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10 order-2 relative">
        <div className="relative z-10 w-full max-w-[420px] bg-white/60 dark:bg-slate-950/40 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.05),0_0_30px_rgba(37,99,235,0.02)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.5),0_0_40px_rgba(37,99,235,0.1)] p-5 sm:p-7 transition-all duration-300">
          {/* Segmented Tab Bar */}
          {mode !== 'forgot' && (
            <div className="relative flex bg-slate-100/80 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 mb-5 backdrop-blur-md">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`relative z-10 flex-1 py-2 text-center text-[13px] sm:text-[14px] font-bold transition-colors duration-200 rounded-xl ${
                  mode === 'login' ? 'text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`relative z-10 flex-1 py-2 text-center text-[13px] sm:text-[14px] font-bold transition-colors duration-200 rounded-xl ${
                  mode === 'register' ? 'text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Register
              </button>
              {/* Animated indicator */}
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 border border-blue-400/20 dark:border-blue-400/30 shadow-[0_2px_12px_rgba(37,99,235,0.15)] dark:shadow-[0_2px_12px_rgba(37,99,235,0.35)] transition-all duration-300 ease-out ${
                  mode === 'login' ? 'left-1.5' : 'left-[calc(50%+3px)]'
                }`}
              />
            </div>
          )}

          {/* Card Header — changes based on mode & step */}
          <div className="mb-4">
            <h2 className="font-poppins text-[22px] sm:text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">
              {mode === 'login'
                ? 'Welcome back'
                : mode === 'forgot'
                  ? 'Reset password'
                  : registerStep === 1
                    ? 'Create an account'
                    : 'Complete your registration'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] sm:text-[14px] mt-1.5 leading-relaxed font-sans font-medium">
              {mode === 'login'
                ? 'Enter your credentials to access your workspace'
                : mode === 'forgot'
                  ? 'Enter your email and set a new secure password'
                  : registerStep === 1
                    ? 'Join the BioPay Student Network in less than 60 seconds'
                    : 'Just a few more details to get started'}
            </p>
          </div>

          {/* ════════════════════ LOGIN FORM ════════════════════ */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="login-email" className={labelClass}>
                  Official Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="login-password" className={labelClass}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-[12px] text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-bold bg-transparent border-none cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-11`}
                    required
                  />
                  {getEyeIcon(showPassword, () => setShowPassword(!showPassword))}
                </div>
              </div>

              {renderMessage()}

              <button
                type="submit"
                disabled={loading}
                className={btnPrimaryClass}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* ════════════════════ REGISTER — STEP 1 ════════════════════ */}
          {mode === 'register' && registerStep === 1 && (
            <form onSubmit={handleRegisterContinue} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1 font-sans">
                  <label htmlFor="reg-email" className={labelClass}>
                    Official Email Address
                  </label>
                  {otpVerified && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300/40 shadow-xs">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (otpVerified) setOtpVerified(false);
                      if (otpSent) setOtpSent(false);
                    }}
                    placeholder="you@organization.com"
                    className={`${inputClass} ${(otpSent || otpVerified) ? 'bg-slate-100/70 dark:bg-slate-900/70 text-slate-500 border-emerald-500/40 cursor-default' : ''}`}
                    autoComplete="email"
                    readOnly={otpSent || otpVerified}
                    required
                  />
                  {!otpVerified && !otpSent && email && email.includes('@') && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={otpLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 rounded-lg transition-all cursor-pointer shadow-sm"
                    >
                      {otpLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                  )}
                </div>
              </div>

              {/* OTP Verification Section (Shown after clicking Send OTP) */}
              {!otpVerified && otpSent && (
                <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <FiShield className="text-primary" /> Enter 6-Digit Verification Code
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="flex-1 px-3 py-2 text-center text-base tracking-widest font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={otpLoading || otpInput.length !== 6}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-all cursor-pointer shadow-sm"
                    >
                      {otpLoading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Didn't receive the email?</span>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendCooldown > 0 || otpLoading}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer flex items-center gap-1"
                    >
                      <FiClock size={11} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>

                  {otpMessage && (
                    <div className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold bg-blue-100/60 dark:bg-blue-900/40 p-2 rounded-lg border border-blue-300/40">
                      {otpMessage}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="reg-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="reg-name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                  required
                />
              </div>

              {renderMessage()}

              <button
                type="submit"
                disabled={!otpVerified}
                className={`${btnPrimaryClass} ${!otpVerified ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
              >
                Continue
              </button>
            </form>
          )}

          {/* ════════════════════ REGISTER — STEP 2 (Dynamic) ════════════════════ */}
          {mode === 'register' && registerStep === 2 && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[62vh] lg:max-h-[520px] overflow-y-auto pr-1">
              {/* Subtle role indicator */}
              {detectedRoleForRegister && ROLE_META[detectedRoleForRegister] && (
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[12px] font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 border shadow-sm ${getRoleBadgeClasses(detectedRoleForRegister)}`}>
                    {ROLE_META[detectedRoleForRegister].icon} {ROLE_META[detectedRoleForRegister].label}
                  </span>
                </div>
              )}

              {/* ── Student fields ── */}
              {detectedRoleForRegister === 'student' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className={labelClass}>College Name</label>
                    <input
                      value={collegeName}
                      onChange={e => setCollegeName(e.target.value)}
                      placeholder="e.g. IIT Patna"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Start Year</label>
                      <input
                        value={startYear}
                        onChange={e => setStartYear(e.target.value)}
                        placeholder="2023"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>End Year</label>
                      <input
                        value={endYear}
                        onChange={e => setEndYear(e.target.value)}
                        placeholder="2027"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                  <label className="flex items-start gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAlumni}
                      onChange={e => setIsAlumni(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span className="text-[12px] text-slate-500 dark:text-slate-400">
                      I've already graduated — sign me up as an <strong>alumnus</strong> to mentor students.
                    </span>
                  </label>
                  {endYear && !isGraduationYearInPast(endYear) && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 mt-2 transition-all">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Would you like to mentor your juniors as a Senior?
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        This enables mentorship features, student Q&A, and senior guidance tabs on your dashboard.
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setRegisterAsSenior(true)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            registerAsSenior 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-750'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegisterAsSenior(false)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            !registerAsSenior 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-750'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
 
              {/* ── Faculty fields ── */}
              {detectedRoleForRegister === 'faculty' && (
                <div className="pt-2">
                  <label className={labelClass}>Institution Name</label>
                  <input
                    value={institutionName}
                    onChange={e => setInstitutionName(e.target.value)}
                    placeholder="e.g. IIT Patna"
                    className={inputClass}
                    required
                  />
                </div>
              )}
 
              {/* ── Recruiter fields ── */}
              {detectedRoleForRegister === 'recruiter' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className={labelClass}>Company Name</label>
                    <input
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Google"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>College / University (Optional)</label>
                    <input
                      value={collegeName}
                      onChange={e => setCollegeName(e.target.value)}
                      placeholder="e.g. Stanford University"
                      className={inputClass}
                    />
                  </div>
                  {collegeName && isRecognisedCollege(collegeName) && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 mt-2 transition-all">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Would you also like to register as an Alumni Mentor for this institution?
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        This will display Alumni mentorship features and Q&A resources alongside your Recruiter tools.
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setRegisterAsAlumni(true)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            registerAsAlumni 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-750'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setRegisterAsAlumni(false)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            !registerAsAlumni 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-750'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Password & Confirm Password (all roles) ── */}
              <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className={`${inputClass} pr-11`}
                      required
                    />
                    {getEyeIcon(showPassword, () => setShowPassword(!showPassword))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputClass} pr-11`}
                      required
                    />
                    {getEyeIcon(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
                  </div>
                </div>
              </div>

              {password && <PasswordChecklist password={password} />}

              <div className="flex items-start gap-2 pt-1 text-left">
                <input
                  id="reg-terms"
                  type="checkbox"
                  checked={terms}
                  onChange={e => setTerms(e.target.checked)}
                  className="mt-1 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="reg-terms" className="text-slate-500 dark:text-slate-400 text-xs leading-normal cursor-pointer select-none">
                  I agree to the Terms of Service & Privacy Policy *
                </label>
              </div>

              {renderMessage()}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setRegisterStep(1); setError(''); }}
                  className="py-3.5 px-5 rounded-xl font-bold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-[14px] border border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FiArrowLeft /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 ${btnPrimaryClass}`}
                >
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          {/* ════════════════════ FORGOT PASSWORD FORM ════════════════════ */}
          {mode === 'forgot' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label htmlFor="forgot-email" className={labelClass}>
                  Official Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="forgot-password" className={labelClass}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="forgot-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-11`}
                    required
                  />
                  {getEyeIcon(showPassword, () => setShowPassword(!showPassword))}
                </div>
              </div>

              <div>
                <label htmlFor="forgot-confirm-password" className={labelClass}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="forgot-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputClass} pr-11`}
                    required
                  />
                  {getEyeIcon(showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}
                </div>
              </div>

              {password && <PasswordChecklist password={password} />}

              {renderMessage()}

              <button
                type="submit"
                disabled={loading}
                className={btnPrimaryClass}
              >
                {loading ? 'Resetting Password…' : 'Reset Password'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[13px] text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-bold bg-transparent border-none cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          <div className="text-center text-[11px] text-slate-500 dark:text-slate-450 mt-4 font-medium">
            © {new Date().getFullYear()} BioPay Student Network • v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
