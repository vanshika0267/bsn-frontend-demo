import React from 'react';

const Select = ({
  label,
  options = [],
  value,
  onChange,
  icon: Icon,
  error,
  required = false,
  className = '',
  id
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-label-md font-label-md text-on-surface-variant">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-on-surface-variant/75 pointer-events-none">
            <Icon size={16} />
          </span>
        )}
        
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full text-body-md rounded-lg py-2 px-4 bsn-input appearance-none cursor-pointer transition-all duration-200 ${
            Icon ? 'pl-10' : ''
          } ${
            error 
              ? 'border-error/50 focus:border-error focus:ring-error/20' 
              : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20'
          }`}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value} className="bg-white text-on-surface">
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom arrow indicator */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-on-surface-variant">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <span className="text-[11px] text-error font-medium mt-0.5 pl-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
