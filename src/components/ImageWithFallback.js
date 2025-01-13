import React, { useState } from 'react';

const ImageWithFallback = ({ src, fallback, alt, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    if (imgSrc !== fallback) {
      console.log('Loading fallback image for:', src);
      setImgSrc(fallback);
    }
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`image-container ${loading ? 'loading' : ''}`}>
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className} ${loading ? 'loading' : ''}`}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback; 