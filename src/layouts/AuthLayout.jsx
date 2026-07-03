import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Login3DBackground from '../components/auth/Login3DBackground';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex bg-surface text-on-surface overflow-x-hidden font-sans">
      {/* Left Column: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 z-10 bg-white border-r border-outline-variant">
        {/* Brand Header */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-poppins font-extrabold text-white text-lg tracking-wider">B</span>
            </div>
            <span className="font-poppins font-bold text-xl tracking-tight text-on-surface">
              BSN <span className="text-primary text-xs font-semibold px-1.5 py-0.5 rounded bg-primary/10 ml-1">STUDENT</span>
            </span>
          </Link>
        </div>

        {/* Content Body */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto my-auto py-8"
        >
          {children}
        </motion.div>

        {/* Footer */}
        <div className="text-center lg:text-left text-xs text-on-surface-variant font-medium">
          © {new Date().getFullYear()} BSN Network. All rights reserved.
        </div>
      </div>

      {/* Right Column: Visual Showcase (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex w-1/2 relative bg-surface-container-low overflow-hidden items-center justify-center p-12 select-none">
        {/* 3D Animation Background */}
        <div className="absolute inset-0 z-0">
          <Login3DBackground />
        </div>
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[size:32px_32px] z-1"></div>

        <div className="max-w-lg w-full relative z-10 flex flex-col gap-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-3"
          >
            <span className="px-3 py-1 rounded-sm text-xs font-semibold bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">
              Student Platform
            </span>
            <h2 className="text-3xl font-extrabold font-poppins tracking-tight leading-tight text-on-surface">
              Build Your Academic Identity.<br/>
              Showcase Skills. Discover Opportunities.
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm font-light">
              BSN converges standard student resumes, open-source project cards, dynamic ranking boards, and direct applications. Make it easier for recruiters to spot you.
            </p>
          </motion.div>

          {/* Interactive Floating Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="w-full rounded-xl bg-white border border-outline-variant shadow-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-poppins">AR</div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Alex Rivera</h4>
                  <p className="text-[10px] text-on-surface-variant">MIT • Computer Science</p>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded bg-[#f0fdf4] border border-[#bbf7d0] text-[10px] font-bold text-[#166534]">
                Score: 840
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                <span>Verification Badges</span>
                <span className="text-primary">95% Profile Completed</span>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-high text-on-surface-variant border border-outline-variant">React.js</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container-high text-on-surface-variant border border-outline-variant">PyTorch</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">★ BioPay Developer</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 bg-surface rounded-lg border border-outline-variant flex items-center justify-between gap-4">
                <div>
                  <h5 className="text-xs font-bold text-on-surface">BioPay Contactless Wallet</h5>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Awarded 1st place in MIT Hackathon</p>
                </div>
                <div className="text-[10px] font-bold text-on-surface-variant bg-surface-container border border-outline-variant px-2 py-1 rounded">
                  ★ 45 Stars
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
