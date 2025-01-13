import React from 'react';
import { Avatar } from '@mui/material';

const ProfileImage = ({ src, alt, className }) => {
  const defaultImage = '/default-avatar.png'; // Add a default avatar image to your public folder

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <Avatar
      src={src || defaultImage}
      alt={alt}
      className={className}
      onError={handleImageError}
      sx={{ width: '100%', height: '100%' }}
    />
  );
};

export default ProfileImage; 