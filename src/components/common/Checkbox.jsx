import React from 'react';

const Checkbox = ({
  label,
  checked,
  onChange,
  id,
  className = '',
  error
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="inline-flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        
        {/* Custom Checkbox Design */}
        <div className="mt-0.5 w-4.5 h-4.5 rounded border border-outline-variant bg-white dark:bg-surface-container-low flex items-center justify-center text-white peer-checked:bg-primary-container peer-checked:border-transparent peer-checked:[&>svg]:opacity-100 transition-all duration-200 focus:outline-none">
          <svg
            className="w-3 h-3 fill-current opacity-0 transition-opacity duration-200"
            viewBox="0 0 20 20"
          >
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        </div>
        
        {label && <span className="text-xs text-on-surface-variant font-medium leading-normal">{label}</span>}
      </label>
      
      {error && (
        <span className="text-[11px] text-error font-medium pl-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Checkbox;
