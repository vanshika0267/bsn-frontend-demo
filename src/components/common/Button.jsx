import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  fullWidth = false
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-container hover:bg-primary text-white border border-transparent',
    secondary: 'bg-white hover:bg-surface-container-low text-on-background border border-outline-variant',
    outline: 'border border-outline hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface',
    glass: 'bg-surface-container-lowest/80 border border-outline-variant text-on-surface hover:bg-surface-container-low',
    success: 'bg-[#22c55e] hover:bg-[#16a34a] text-white border border-transparent'
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs font-label-md',
    md: 'px-4.5 py-2.5 text-sm font-label-md',
    lg: 'px-6 py-3.5 text-base font-h3'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
