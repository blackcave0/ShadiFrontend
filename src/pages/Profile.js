import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
  ImageList,
  ImageListItem,
  Dialog,
  DialogContent,
  Grid,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Close,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../styles/Profile.module.css';
import { BASE_URL } from '../utils/base';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setOpenPhotoDialog(true);
  };

  const handlePhotoUpload = async (event) => {
    try {
      const files = Array.from(event.target.files);
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('photos', file);
      });

      const token = localStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/api/profile/photos`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setProfileData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          photos: response.data.photos
        }
      }));

      toast.success('Photos uploaded successfully');
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className={styles.mainContainer}>
      <Box className={styles.profileWrapper}>
        <Typography variant="h1" className={styles.mainTitle}>
          Profile
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          {profileData?.profile?.occupation || "I'm a creative web developer"}
        </Typography>

        <Grid container spacing={3} className={styles.contentGrid}>
          {/* Left Column - Details & About */}
          <Grid item xs={12} md={8}>
            <Box className={styles.leftColumn}>
              {/* Details Section */}
              <Box className={styles.detailsSection}>
                <Typography variant="h6" className={styles.sectionTitle}>
                  Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box className={styles.detailItem}>
                      <Typography variant="subtitle2" className={styles.detailLabel}>
                        Name:
                      </Typography>
                      <Typography className={styles.detailValue}>
                        {profileData?.profile?.firstName} {profileData?.profile?.lastName}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box className={styles.detailItem}>
                      <Typography variant="subtitle2" className={styles.detailLabel}>
                        Age:
                      </Typography>
                      <Typography className={styles.detailValue}>
                        {calculateAge(profileData?.profile?.dateOfBirth)} years
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box className={styles.detailItem}>
                      <Typography variant="subtitle2" className={styles.detailLabel}>
                        Location:
                      </Typography>
                      <Typography className={styles.detailValue}>
                        {profileData?.profile?.location}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box className={styles.detailItem}>
                      <Typography variant="subtitle2" className={styles.detailLabel}>
                        Religion:
                      </Typography>
                      <Typography className={styles.detailValue}>
                        {profileData?.profile?.religion}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* About Section */}
              <Box className={styles.aboutSection}>
                <Typography variant="h6" className={styles.sectionTitle}>
                  About me
                </Typography>
                <Typography className={styles.aboutText}>
                  {profileData?.profile?.about || 
                    "I am an all-round web designer. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}
                </Typography>
                <Button variant="outlined" className={styles.contactButton}>
                  CONTACT ME
                </Button>
              </Box>

              {/* Photos Section */}
              <Box className={styles.photosSection}>
                <Box className={styles.sectionHeader}>
                  <Typography variant="h6" className={styles.sectionTitle}>
                    My Photos
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<AddIcon />}
                    className={styles.uploadButton}
                  >
                    Upload Photos
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </Button>
                </Box>
                <ImageList cols={3} gap={16} className={styles.photoGrid}>
                  {profileData?.profile?.photos?.map((photo, index) => (
                    <ImageListItem 
                      key={index} 
                      className={styles.photoItem}
                      onClick={() => handlePhotoClick(photo)}
                    >
                      <img
                        src={photo}
                        alt={`Gallery item ${index + 1}`}
                        loading="lazy"
                        className={styles.photo}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Profile Card */}
          <Grid item xs={12} md={4}>
            <Box className={styles.profileCard}>
              <Avatar
                src={profileData?.profile?.profilePicture}
                alt={`${profileData?.profile?.firstName} ${profileData?.profile?.lastName}`}
                className={styles.profileImage}
              />
              <Typography variant="h5" className={styles.profileName}>
                HELLO, I'M {profileData?.profile?.firstName?.toUpperCase()}
              </Typography>
              <Typography className={styles.profileDescription}>
                {profileData?.profile?.occupation}
              </Typography>
              <Box className={styles.socialLinks}>
                <IconButton className={styles.socialIcon}>
                  <Facebook />
                </IconButton>
                <IconButton className={styles.socialIcon}>
                  <Twitter />
                </IconButton>
                <IconButton className={styles.socialIcon}>
                  <Instagram />
                </IconButton>
                <IconButton className={styles.socialIcon}>
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Photo Dialog */}
      <Dialog
        open={openPhotoDialog}
        onClose={() => setOpenPhotoDialog(false)}
        maxWidth="md"
        fullWidth
        className={styles.photoDialog}
      >
        <IconButton
          onClick={() => setOpenPhotoDialog(false)}
          className={styles.closeButton}
        >
          <Close />
        </IconButton>
        <DialogContent className={styles.dialogContent}>
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt="Selected gallery item"
              className={styles.selectedPhoto}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Profile; 