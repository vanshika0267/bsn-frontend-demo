import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  onClick,
  ...props 
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-outline-variant p-5 transition-all duration-300 shadow-sm ${
        hoverable ? 'hover:shadow-md hover:border-primary cursor-pointer transform hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
