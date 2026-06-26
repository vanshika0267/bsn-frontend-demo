import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase';
  
  const variants = {
    default: 'bg-surface-container-high text-on-surface-variant border border-outline-variant',
    primary: 'bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]',
    success: 'bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]',
    warning: 'bg-[#fefce8] text-[#854d0e] border border-[#fef08a]',
    error: 'bg-[#fef2f2] text-[#991b1b] border border-[#fca5a5]',
    purple: 'bg-[#faf5ff] text-[#6b21a8] border border-[#e9d5ff]',
    indigo: 'bg-[#eef2ff] text-[#3730a3] border border-[#c7d2fe]'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
