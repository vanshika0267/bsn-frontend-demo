import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/common/InputField';
import Checkbox from '../../components/common/Checkbox';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Please enter a valid email address";
    
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      login(email, password, 'Student');
      navigate('/dashboard');
    }
  };

  const handleGoogleSignIn = () => {
    login('alex.rivera@university.edu', 'secret123', 'Student');
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-poppins text-on-surface">Welcome back</h1>
          <p className="text-xs text-on-surface-variant">Login to your student account to check updates.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="College Email Address"
            type="email"
            placeholder="name@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FiMail}
            error={errors.email}
            required
            id="email-input"
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={FiLock}
            error={errors.password}
            required
            id="password-input"
          />

          <div className="flex items-center justify-between gap-4 pt-1">
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              id="remember-me"
            />
            <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </a>
          </div>

          <Button type="submit" variant="primary" fullWidth className="gap-2 mt-2 py-3">
            <FiLogIn size={16} /> Sign In
          </Button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-x-0 h-[1px] bg-outline-variant"></div>
          <span className="relative px-3 text-[10px] uppercase font-bold text-on-surface-variant bg-white tracking-wider">
            Or continue with
          </span>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-outline-variant bg-white hover:bg-surface-container px-4 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors focus:outline-none"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.484 0-6.29-2.905-6.29-6.514 0-3.61 2.806-6.515 6.29-6.515 1.5 0 2.87.525 3.96 1.485l3.15-3.15C18.17 1.05 15.345 0 12.24 0 5.865 0 .685 5.25.685 12c0 6.75 5.18 12 11.555 12 6.51 0 11.235-4.47 11.235-11.22 0-.705-.075-1.395-.195-2.07H12.24z"
            />
          </svg>
          Google
        </button>

        {/* Link to Signup */}
        <p className="text-center text-xs text-on-surface-variant font-medium pt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-bold hover:text-primary/80 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
