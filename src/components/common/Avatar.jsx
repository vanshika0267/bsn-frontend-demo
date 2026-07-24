import React, { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';

const Avatar = ({ src, alt = 'User avatar', className = '' }) => {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [src]);

  const normalizedSrc = typeof src === 'string' ? src.trim() : '';
  const shouldShowImage = normalizedSrc && !errored;

  return shouldShowImage ? (
    <img
      src={normalizedSrc}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={() => setErrored(true)}
    />
  ) : (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-inner">
        <FiUser size={28} className="text-slate-500 dark:text-slate-300" />
      </div>
    </div>
  );
};

export default Avatar;
