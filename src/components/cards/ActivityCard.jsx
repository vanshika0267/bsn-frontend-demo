import React from 'react';
import { FiClock } from 'react-icons/fi';

const ActivityCard = ({
  icon = "📄",
  title,
  timestamp,
  description,
  className = ''
}) => {
  return (
    <div className={`flex gap-3.5 p-3.5 bg-white rounded-xl border border-outline-variant hover:bg-surface transition-colors ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-lg select-none">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-on-surface truncate">{title}</h4>
        {description && <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{description}</p>}
        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-on-surface-variant/75 font-medium">
          <FiClock size={11} />
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
