import React, { useState } from 'react';
import { Container, Box, Grid, Paper, Typography } from '@mui/material';
import RegisterForm from '../components/RegisterForm';
import ProfileSkeleton from '../components/ProfileSkeleton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import styles from '../styles/Register.module.css';

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (isSubmitting) {
    return <ProfileSkeleton />;
  }

  return (
    <Container 
      maxWidth="lg" 
      className={styles.registerContainer}
      onKeyDown={handleKeyDown}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={5} className={styles.welcomeSection}>
          <Box className={styles.welcomeContent}>
            <Box className={styles.illustration}>
              <FavoriteIcon sx={{ fontSize: 100, color: '#FF385C' }} />
            </Box>
            <Typography variant="h4" className={styles.welcomeTitle}>
              Find Your Perfect Match
            </Typography>
            <Typography variant="body1" className={styles.welcomeText}>
              Join thousands of happy couples who found their soulmate with ShadiApp
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper 
            elevation={3} 
            className={styles.formPaper}
            onKeyDown={handleKeyDown}
          >
            <RegisterForm onSubmitStart={() => setIsSubmitting(true)} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register; 