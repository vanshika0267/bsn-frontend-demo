import React, { useEffect, useState } from 'react';

const CoverBanner = ({ src, alt = 'Cover banner', className = '' }) => {
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
    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 ${className}`}>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.25),_transparent_30%)]" />
    </div>
  );
};

export default CoverBanner;
