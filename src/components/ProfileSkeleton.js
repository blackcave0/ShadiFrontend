import React from 'react';
import { 
  Container, 
  Box, 
  Paper, 
  Grid, 
  Skeleton 
} from '@mui/material';
import styles from '../styles/Profile.module.css';

const ProfileSkeleton = () => {
  return (
    <Container maxWidth="md" className={styles.profileContainer}>
      <Paper elevation={3} className={styles.profilePaper}>
        <Box className={styles.profileHeader}>
          <Skeleton variant="text" width={200} height={40} />
          <Box>
            <Skeleton variant="circular" width={40} height={40} sx={{ ml: 1 }} />
            <Skeleton variant="circular" width={40} height={40} sx={{ ml: 1 }} />
          </Box>
        </Box>

        <Skeleton variant="rectangular" width="100%" height={2} sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box className={styles.photoSection}>
              <Skeleton variant="circular" width={200} height={200} />
              <Box className={styles.additionalPhotos}>
                {[1, 2, 3].map((index) => (
                  <Skeleton 
                    key={index}
                    variant="circular" 
                    width={100} 
                    height={100} 
                    sx={{ m: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={24} />
              </Box>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfileSkeleton; 