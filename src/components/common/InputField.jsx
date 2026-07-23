import React from 'react';

const InputField = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  id,
  inputRef,
  ...props
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
        
        <input
          type={type}
          id={id}
          ref={inputRef}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
          className={`w-full text-body-md rounded-lg py-2 px-4 bsn-input transition-all duration-200 ${
            Icon ? 'pl-10' : ''
          } ${
            error 
              ? 'border-error/50 focus:border-error focus:ring-error/20' 
              : 'border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20'
          } ${
            disabled ? 'opacity-70 bg-surface-container-low cursor-not-allowed select-none' : ''
          } ${
            readOnly ? 'bg-surface-container-low/60 text-on-surface border-outline-variant/60 cursor-default focus:border-outline-variant focus:ring-0' : ''
          }`}
        />
      </div>

      {error && (
        <span className="text-[11px] text-error font-medium mt-0.5 pl-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
