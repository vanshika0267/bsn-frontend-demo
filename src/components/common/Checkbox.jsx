import React from 'react';

const Checkbox = ({
  label,
  checked = false,
  onChange,
  id,
  className = '',
  error,
  disabled = false,
  ...props
}) => {
  const isChecked = Boolean(checked);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={onChange}
          disabled={disabled}
          role="switch"
          aria-checked={isChecked}
          className="sr-only peer"
          {...props}
        />
        
        {/* Custom Checkbox Design */}
        <div
          className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center text-white transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 focus:outline-none ${
            isChecked
              ? 'bg-primary border-primary text-white'
              : 'border-outline-variant bg-white dark:bg-surface-container-low hover:border-primary/50'
          }`}
        >
          <svg
            className={`w-3 h-3 text-white fill-current transition-opacity duration-200 ${
              isChecked ? 'opacity-100' : 'opacity-0'
            }`}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        </div>
        
        {label && (
          <span className="text-xs text-on-surface-variant font-medium leading-normal">
            {label}
          </span>
        )}
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
