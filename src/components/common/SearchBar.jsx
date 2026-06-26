import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search...', 
  className = '' 
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <FiSearch className="absolute left-3.5 h-4 w-4 text-on-surface-variant/75 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg text-sm font-sans bsn-input"
      />
    </div>
  );
};

export default SearchBar;
