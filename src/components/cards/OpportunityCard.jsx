import React, { useState } from 'react';
import { FiCalendar, FiMapPin, FiAward } from 'react-icons/fi';
import Button from '../common/Button';
import Badge from '../common/Badge';

const OpportunityCard = ({
  opportunity,
  onApply
}) => {
  const { title, host, type, location, reward, deadline, logo, tags, description } = opportunity;
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    if (onApply) onApply(opportunity);
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-outline-variant hover:border-primary shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-xl select-none shadow-inner">
              {logo || '💼'}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{type}</span>
              <h3 className="text-sm font-bold text-on-surface hover:text-primary transition-colors leading-snug line-clamp-1 cursor-pointer">
                {title}
              </h3>
              <p className="text-xs text-on-surface-variant font-semibold">{host}</p>
            </div>
          </div>
          <Badge variant={type === 'Hackathon' ? 'purple' : type === 'Internship' ? 'primary' : 'success'}>
            {type}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-on-surface-variant mt-3.5 line-clamp-2 leading-relaxed font-light">
          {description}
        </p>

        {/* Technical Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-surface-container border border-outline-variant text-on-surface-variant">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-4 border-t border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-4 gap-y-2 text-[11px] text-on-surface-variant font-medium">
          <span className="flex items-center gap-1.5">
            <FiAward className="text-[#166534]" size={13} />
            <span>{reward}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <FiCalendar className="text-error" size={13} />
            <span>{deadline}</span>
          </span>
          <span className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <FiMapPin className="text-primary" size={13} />
            <span className="truncate max-w-[120px]">{location}</span>
          </span>
        </div>

        <div className="flex gap-2">
          <Button 
            variant={applied ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleApply}
            disabled={applied}
            className="flex-1 sm:flex-initial"
          >
            {applied ? 'Applied' : 'Apply Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
