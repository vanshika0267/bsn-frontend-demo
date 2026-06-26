import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  progress,
  color = 'blue',
  className = ''
}) => {
  const borderColors = {
    blue: 'hover:border-primary',
    green: 'hover:border-[#22c55e]',
    purple: 'hover:border-[#a855f7]',
    orange: 'hover:border-[#f97316]',
    indigo: 'hover:border-[#6366f1]',
  };

  const progressColors = {
    blue: 'bg-primary',
    green: 'bg-[#22c55e]',
    purple: 'bg-[#a855f7]',
    orange: 'bg-[#f97316]',
    indigo: 'bg-[#6366f1]',
  };

  const bgIcons = {
    blue: 'bg-[#eff6ff] text-primary',
    green: 'bg-[#f0fdf4] text-[#166534]',
    purple: 'bg-[#faf5ff] text-[#6b21a8]',
    orange: 'bg-[#fff7ed] text-[#c2410c]',
    indigo: 'bg-[#eef2ff] text-[#3730a3]',
  };

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`bg-white p-5 rounded-xl flex flex-col justify-between transition-all duration-300 border border-outline-variant shadow-sm hover:shadow-md ${borderColors[color] || borderColors.blue} ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{title}</span>
          <h3 className="text-2xl font-bold mt-1 font-poppins text-on-surface">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${bgIcons[color]} flex items-center justify-center`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      
      {progress !== undefined && (
        <div className="mt-2">
          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-full rounded-full ${progressColors[color]}`}
            />
          </div>
          {subtitle && (
            <span className="text-[10px] text-on-surface-variant font-semibold mt-1.5 block">{subtitle}</span>
          )}
        </div>
      )}

      {progress === undefined && subtitle && (
        <span className="text-xs text-on-surface-variant mt-1 font-medium">{subtitle}</span>
      )}
    </motion.div>
  );
};

export default StatCard;
