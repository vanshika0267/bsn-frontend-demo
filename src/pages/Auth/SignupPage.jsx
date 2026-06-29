import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiBookOpen, FiUserCheck } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import AuthLayout from '../../layouts/AuthLayout';
import InputField from '../../components/common/InputField';
import Select from '../../components/common/Select';
import Checkbox from '../../components/common/Checkbox';
import Button from '../../components/common/Button';

const SignupPage = () => {
  const { register } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [college, setCollege] = useState('Massachusetts Institute of Technology');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const collegeOptions = [
    { value: "Massachusetts Institute of Technology", label: "Massachusetts Institute of Technology (MIT)" },
    { value: "Stanford University", label: "Stanford University" },
    { value: "IIT Bombay", label: "IIT Bombay" },
    { value: "Oxford University", label: "Oxford University" },
    { value: "UC Berkeley", label: "UC Berkeley" }
  ];

  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Full name is required";
    
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Please enter a valid email address";
    
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
    if (password !== confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
    
    if (!terms) tempErrors.terms = "You must accept the Terms and Conditions";
 
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    try {
      await register({ name, email, password, college });
      navigate('/dashboard');
    } catch (err) {
      setErrors({ email: err.message || 'Registration failed' });
    }
  }
};

  const handleGoogleSignUp = () => {
    login('alex.rivera@university.edu', 'secret123', 'Student');
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-poppins text-on-surface">Create your account</h1>
          <p className="text-xs text-on-surface-variant">Join your campus academic network and build your portfolio.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <InputField
            label="Full Name"
            placeholder="Alex Rivera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={FiUser}
            error={errors.name}
            required
            id="name-input"
          />

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

          <Select
            label="College/University"
            options={collegeOptions}
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            icon={FiBookOpen}
            id="college-select"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={FiLock}
              error={errors.confirmPassword}
              required
              id="confirm-password-input"
            />
          </div>

          <div className="pt-1">
            <Checkbox
              label="I agree to the Terms of Service & Privacy Policy"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              id="terms-check"
              error={errors.terms}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth className="gap-2 mt-2 py-3">
            <FiUserCheck size={16} /> Register Account
          </Button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center justify-center my-3.5">
          <div className="absolute inset-x-0 h-[1px] bg-outline-variant"></div>
          <span className="relative px-3 text-[10px] uppercase font-bold text-on-surface-variant bg-white tracking-wider">
            Or register with
          </span>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignUp}
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

        {/* Link to Login */}
        <p className="text-center text-xs text-on-surface-variant font-medium pt-1">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:text-primary/80 transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
