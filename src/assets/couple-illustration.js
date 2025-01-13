import React from 'react';
import { SvgIcon } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const CoupleIllustration = (props) => (
  <SvgIcon {...props} sx={{ width: '100%', height: '100%', fontSize: '200px', color: '#FF385C' }}>
    <FavoriteIcon />
  </SvgIcon>
);

export default CoupleIllustration; 