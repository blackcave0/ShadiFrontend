import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  // Chip,
  // Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // Slider,
  // TextField,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Close as CloseIcon,
  LocationOn,
  Work,
  School,
  // Message as MessageIcon,
  // Person,
  // Cake,
  VolunteerActivism,
  Block,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../styles/Matches.module.css';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({
    minAge: '0',
    maxAge: '100',
    religion: ''
  });
  const [view, setView] = useState('potential');
  const [likedProfiles, setLikedProfiles] = useState([]);

  useEffect(() => {
    fetchMatches();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/matches/potential', {
        headers: { Authorization: `Bearer ${token}` },
        params: filters
      });
      setMatches(response.data.matches);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Failed to load matches');
      setLoading(false);
    }
  };

  const handleLike = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/matches/like/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.isMatch) {
        toast.success("It's a match! 🎉");
      } else {
        toast.success('Profile liked!');
      }
      
      setMatches(prev => prev.filter(match => match._id !== userId));
      
      if (view === 'liked') {
        fetchLikedProfiles();
      }
    } catch (error) {
      toast.error('Failed to like profile');
    }
  };

  const handlePass = (userId) => {
    setMatches(prev => prev.filter(match => match._id !== userId));
    toast.info('Profile skipped');
  };

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setOpenDialog(true);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchMatches();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ageOptions = Array.from({ length: 101 }, (_, i) => i.toString());

  const renderFilters = () => (
    <Box className={styles.filtersSection}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Religion</InputLabel>
            <Select
              name="religion"
              value={filters.religion}
              onChange={handleFilterChange}
              label="Religion"
            >
              <MenuItem value="">All Religions</MenuItem>
              <MenuItem value="Hindu">Hindu</MenuItem>
              <MenuItem value="Muslim">Muslim</MenuItem>
              <MenuItem value="Christian">Christian</MenuItem>
              <MenuItem value="Sikh">Sikh</MenuItem>
              <MenuItem value="Buddhist">Buddhist</MenuItem>
              <MenuItem value="Jain">Jain</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Min Age</InputLabel>
            <Select
              name="minAge"
              value={filters.minAge}
              onChange={handleFilterChange}
              label="Min Age"
            >
              {ageOptions.map((age) => (
                <MenuItem 
                  key={age} 
                  value={age}
                  disabled={parseInt(age) > parseInt(filters.maxAge)}
                >
                  {age} years
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Max Age</InputLabel>
            <Select
              name="maxAge"
              value={filters.maxAge}
              onChange={handleFilterChange}
              label="Max Age"
            >
              {ageOptions.map((age) => (
                <MenuItem 
                  key={age} 
                  value={age}
                  disabled={parseInt(age) < parseInt(filters.minAge)}
                >
                  {age} years
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const fetchLikedProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/matches/liked', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikedProfiles(response.data.likedProfiles);
    } catch (error) {
      console.error('Error fetching liked profiles:', error);
      toast.error('Failed to load liked profiles');
    }
  };

  useEffect(() => {
    if (view === 'liked') {
      fetchLikedProfiles();
    }
  }, [view]);

  const renderTabs = () => (
    <Box className={styles.tabsContainer}>
      <Button
        variant={view === 'potential' ? 'contained' : 'outlined'}
        onClick={() => setView('potential')}
        className={styles.tabButton}
      >
        Discover
      </Button>
      <Button
        variant={view === 'liked' ? 'contained' : 'outlined'}
        onClick={() => setView('liked')}
        className={styles.tabButton}
        startIcon={<FavoriteIcon />}
      >
        Liked Profiles
      </Button>
    </Box>
  );

  const renderContent = () => {
  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={60} className={styles.loader} />
      </Box>
    );
  }

    if (view === 'liked') {
      if (likedProfiles.length === 0) {
  return (
        <Box className={styles.noMatches}>
          <FavoriteIcon className={styles.noMatchesIcon} />
          <Typography variant="h6">
              No liked profiles yet
          </Typography>
          <Typography variant="body1" color="textSecondary">
              Start liking profiles to see them here
            </Typography>
          </Box>
        );
      }

      return (
        <Grid container spacing={3} className={styles.matchesGrid}>
          {likedProfiles.map((profile) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={profile._id}>
              <Card className={styles.matchCard}>
                <Box className={styles.cardMediaWrapper}>
                  <img
                    src={profile.profile.profilePicture}
                    alt={profile.profile.firstName}
                    className={styles.cardMedia}
                  />
                  <Box className={styles.cardOverlay}>
                    <Button
                      variant="contained"
                      className={styles.viewProfileBtn}
                      onClick={() => handleViewProfile(profile)}
                    >
                      View Profile
                    </Button>
                  </Box>
                </Box>

                <CardContent className={styles.cardContent}>
                  <Typography variant="h6" className={styles.name}>
                    {profile.profile.firstName}, {profile.profile.age}
                  </Typography>

                  <Box className={styles.infoSection}>
                    {profile.profile.occupation && (
                      <Box className={styles.infoItem}>
                        <Work className={styles.infoIcon} />
                        <Typography variant="body2">
                          {profile.profile.occupation}
                        </Typography>
                      </Box>
                    )}
                    {profile.profile.location && (
                      <Box className={styles.infoItem}>
                        <LocationOn className={styles.infoIcon} />
                        <Typography variant="body2">
                          {profile.profile.location}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box className={styles.likeCount}>
                    <FavoriteIcon className={styles.likeIcon} />
                    <Typography variant="body2">
                      {profile.likesCount || 0} likes
          </Typography>
        </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    return (
        <Grid container spacing={3} className={styles.matchesGrid}>
          {matches.map((match) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={match._id}>
              <Card className={styles.matchCard}>
                <Box className={styles.cardMediaWrapper}>
                  <img
                    src={match.profile.profilePicture}
                    alt={match.profile.firstName}
                    className={styles.cardMedia}
                  />
                  <Box className={styles.cardOverlay}>
                    <Button
                      variant="contained"
                      className={styles.viewProfileBtn}
                      onClick={() => handleViewProfile(match)}
                    >
                      View Profile
                    </Button>
                  </Box>
                </Box>

                <CardContent className={styles.cardContent}>
                  <Typography variant="h6" className={styles.name}>
                    {match.profile.firstName}, {match.profile.age}
                  </Typography>

                  <Box className={styles.infoSection}>
                    {match.profile.occupation && (
                      <Box className={styles.infoItem}>
                        <Work className={styles.infoIcon} />
                        <Typography variant="body2">
                          {match.profile.occupation}
                        </Typography>
                      </Box>
                    )}
                    {match.profile.location && (
                      <Box className={styles.infoItem}>
                        <LocationOn className={styles.infoIcon} />
                        <Typography variant="body2">
                          {match.profile.location}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box className={styles.actionButtons}>
                    <IconButton
                      className={`${styles.actionButton} ${styles.passButton}`}
                      onClick={() => handlePass(match._id)}
                    >
                      <CloseIcon />
                    </IconButton>
                    <IconButton
                      className={`${styles.actionButton} ${styles.likeButton}`}
                      onClick={() => handleLike(match._id)}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
    );
  };

  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress size={60} className={styles.loader} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Box className={styles.headerSection}>
        <Typography variant="h4" className={styles.title}>
          Find Your Perfect Match
          <VolunteerActivism className={styles.titleIcon} />
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          Discover people who share your interests and values
        </Typography>
      </Box>

      {renderTabs()}
      {view === 'potential' && renderFilters()}
      {renderContent()}

      {/* Profile Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        className={styles.dialog}
      >
        <DialogTitle className={styles.dialogTitle}>
          <Box className={styles.dialogTitleContent}>
            <Typography variant="h5">
              {selectedProfile?.profile.firstName}, {selectedProfile?.profile.age}
            </Typography>
            <IconButton
              onClick={() => setOpenDialog(false)}
              className={styles.closeButton}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent className={styles.dialogContent}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className={styles.profileImageSection}>
                <img
                  src={selectedProfile?.profile.profilePicture}
                  alt={selectedProfile?.profile.firstName}
                  className={styles.profileImage}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={styles.profileDetails}>
                <Box className={styles.detailSection}>
                  <Typography variant="h6" gutterBottom>
                    About Me
                  </Typography>
                  <Typography>
                    {selectedProfile?.profile.about || 'No description provided'}
                  </Typography>
                </Box>

                <Box className={styles.detailSection}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedProfile?.profile.occupation && (
                      <Grid item xs={12}>
                        <Box className={styles.detailItem}>
                          <Work className={styles.detailIcon} />
                          <Typography>{selectedProfile.profile.occupation}</Typography>
                        </Box>
                      </Grid>
                    )}
                    {selectedProfile?.profile.location && (
                      <Grid item xs={12}>
                        <Box className={styles.detailItem}>
                          <LocationOn className={styles.detailIcon} />
                          <Typography>{selectedProfile.profile.location}</Typography>
                        </Box>
                      </Grid>
                    )}
                    {selectedProfile?.profile.education && (
                      <Grid item xs={12}>
                        <Box className={styles.detailItem}>
                          <School className={styles.detailIcon} />
                          <Typography>{selectedProfile.profile.education}</Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className={styles.dialogActions}>
          <Button
            variant="outlined"
            startIcon={<Block />}
            onClick={() => {
              handlePass(selectedProfile._id);
              setOpenDialog(false);
            }}
            className={styles.passButton}
          >
            Pass
          </Button>
          <Button
            variant="contained"
            startIcon={<FavoriteIcon />}
            onClick={() => {
              handleLike(selectedProfile._id);
              setOpenDialog(false);
            }}
            className={styles.likeButtonFull}
          >
            Like Profile
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Matches; 