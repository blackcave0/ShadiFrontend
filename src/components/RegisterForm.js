import React, { useState, useCallback } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Avatar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Email,
  Lock,
  Person,
  // Cake,
  LocationOn,
  // Work,
  ChevronRight,
  ChevronLeft,
  CloudUpload,
  Delete,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import styles from '../styles/RegisterForm.module.css';
import { toast } from 'react-toastify';
import { RELIGIONS, OCCUPATIONS } from '../utils/constants';

const steps = ['Basic Info', 'Personal Details', 'Photos', 'Preferences'];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function RegisterForm(props) {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: null,
    religion: '',
    occupation: '',
    location: '',
    about: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [postPictures, setPostPictures] = useState([]);
  const [postPicturesPreviews, setPostPicturesPreviews] = useState([]);

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 0:
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        break;
      case 1:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        break;
      case 2:
        if (!profilePicture) newErrors.profilePicture = 'Profile picture is required';
        break;
      default:
        break;
    }
    return newErrors;
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Profile picture must be less than 5MB');
        return;
      }
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const onPostPicturesDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length + postPictures.length > 4) {
      toast.error('Maximum 4 post pictures allowed');
      return;
    }

    const validFiles = acceptedFiles.filter(file => file.size <= MAX_FILE_SIZE);
    if (validFiles.length !== acceptedFiles.length) {
      toast.warning('Some files were skipped as they exceed 5MB size limit');
    }
    
    setPostPictures(prevPhotos => [...prevPhotos, ...validFiles]);
    setPostPicturesPreviews(prevPreviews => [
      ...prevPreviews,
      ...validFiles.map(file => URL.createObjectURL(file))
    ]);
  }, [postPictures]);

  const removePostPicture = (index) => {
    setPostPictures(prev => prev.filter((_, i) => i !== index));
    setPostPicturesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onPostPicturesDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const handleNext = () => {
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length === 0) {
      setActiveStep((prev) => prev + 1);
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepErrors = validateStep(activeStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    try {
      props.onSubmitStart?.();
      const formDataToSend = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add profile picture first
      if (profilePicture) {
        console.log('Adding profile picture:', profilePicture); // Debug log
        formDataToSend.append('profilePicture', profilePicture);
      }
      
      // Add post pictures
      if (postPictures.length > 0) {
        console.log('Adding post pictures:', postPictures); // Debug log
      postPictures.forEach(photo => {
        formDataToSend.append('postPictures', photo);
      });
      }

      // Log the FormData contents
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post('/api/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Registration response:', response.data); // Debug log
      localStorage.setItem('token', response.data.token);
      toast.success('Registration successful!');
      
      setTimeout(() => {
        window.location.href = '/profile';
      }, 1000);
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      setErrors({ submit: error.response?.data?.message || 'Registration failed' });
      props.onSubmitStart?.(false);
    }
  };

  const handleKeyDown = (e) => {
    // Prevent form submission and next step on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const renderPhotoUploadStep = () => (
    <Grid container spacing={3}>
      {/* Profile Picture Upload */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Profile Picture
        </Typography>
        <Box className={styles.profilePictureUpload}>
          <input
            accept="image/*"
            type="file"
            id="profile-picture-upload"
            hidden
            onChange={handleProfilePictureChange}
          />
          <label htmlFor="profile-picture-upload">
            <Box className={styles.profilePicturePreview}>
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile Preview"
                  className={styles.previewImage}
                />
              ) : (
                <Person sx={{ fontSize: 60, color: 'primary.main' }} />
              )}
              <Button
                variant="contained"
                component="span"
                className={styles.uploadButton}
              >
                Upload Profile Picture
              </Button>
            </Box>
          </label>
          {errors.profilePicture && (
            <Typography color="error" variant="caption">
              {errors.profilePicture}
            </Typography>
          )}
        </Box>
      </Grid>

      {/* Post Pictures Upload */}
{/*       <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Additional Pictures (Optional, Max 4)
        </Typography>
        <Box
          {...getRootProps()}
          className={`${styles.photoUploadBox} ${isDragActive ? styles.photoUploadActive : ''}`}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography>
            Drag & drop photos here, or click to select files
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Maximum file size: 5MB
          </Typography>
        </Box>
      </Grid> */}
      
      {/* Post Pictures Preview */}
      {postPicturesPreviews.length > 0 && (
        <Grid item xs={12}>
          <Grid container spacing={2} className={styles.photoPreviewGrid}>
            {postPicturesPreviews.map((preview, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box position="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className={styles.photoPreview}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removePostPicture(index)}
                    className={styles.removePhotoButton}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      )}
    </Grid>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                error={!!errors.email}
                helperText={errors.email}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                error={!!errors.password}
                helperText={errors.password}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  required
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography variant="caption" color="error">
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(newValue) => setFormData({...formData, dateOfBirth: newValue})}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      required: true,
                      error: !!errors.dateOfBirth,
                      helperText: errors.dateOfBirth,
                    } 
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        );
      case 2:
        return renderPhotoUploadStep();
      case 3:
        return (
          <Grid container spacing={2} onKeyDown={handleKeyDown}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Religion</InputLabel>
                <Select
                  value={formData.religion}
                  label="Religion"
                  onChange={(e) => setFormData({...formData, religion: e.target.value})}
                  onKeyDown={handleKeyDown}
                  MenuProps={{
                    PaperProps: {
                      onKeyDown: handleKeyDown
                    }
                  }}
                >
                  {RELIGIONS.map((religion) => (
                    <MenuItem 
                      key={religion} 
                      value={religion}
                      onKeyDown={handleKeyDown}
                    >
                      {religion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Occupation</InputLabel>
                <Select
                  value={formData.occupation}
                  label="Occupation"
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                  onKeyDown={handleKeyDown}
                  MenuProps={{
                    PaperProps: {
                      onKeyDown: handleKeyDown
                    }
                  }}
                >
                  {OCCUPATIONS.map((occupation) => (
                    <MenuItem 
                      key={occupation} 
                      value={occupation}
                      onKeyDown={handleKeyDown}
                    >
                      {occupation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                onKeyDown={handleKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="About Yourself"
                value={formData.about}
                onChange={(e) => setFormData({...formData, about: e.target.value})}
                onKeyDown={handleKeyDown}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  const renderTestimonialCards = () => (
    <Box className={styles.testimonials}>
      <Typography variant="h6" gutterBottom align="center" color="primary">
        Success Stories
      </Typography>
      <Grid container spacing={2}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={styles.testimonialCard}>
              <CardContent>
                <Box className={styles.testimonialHeader}>
                  <Avatar 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className={styles.testimonialAvatar}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.location}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" className={styles.testimonialText}>
                  "{testimonial.text}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box className={styles.formContainer}>
      <Typography variant="h5" align="center" gutterBottom className={styles.formTitle}>
        Create Your Profile
      </Typography>
      
      <Stepper activeStep={activeStep} className={styles.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form 
        onSubmit={(e) => {
          // Only allow form submission via the submit button
          if (e.submitter?.type !== 'submit') {
            e.preventDefault();
            return;
          }
          handleSubmit(e);
        }}
        className={styles.form}
        onKeyDown={handleKeyDown}
      >
        <Box className={styles.formContent}>
          {renderStepContent(activeStep)}
        </Box>
        
        <Box className={styles.formActions}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            startIcon={<ChevronLeft />}
            type="button"
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              endIcon={<ChevronRight />}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNext}
              endIcon={<ChevronRight />}
              type="button"
            >
              Next
            </Button>
          )}
        </Box>
      </form>

      {/* Testimonials section */}
      {renderTestimonialCards()}
    </Box>
  );
}

const testimonials = [
  {
    name: "Sarah & John",
    location: "New York",
    image: "https://source.unsplash.com/random/100x100/?woman",
    text: "We found each other on ShadiApp and got married within a year. It's been an amazing journey!"
  },
  {
    name: "Priya & Rahul",
    location: "Mumbai",
    image: "https://source.unsplash.com/random/100x100/?indian,couple",
    text: "Thanks to ShadiApp, we found our perfect match. The platform made it so easy to connect!"
  },
  {
    name: "Alex & Maria",
    location: "London",
    image: "https://source.unsplash.com/random/100x100/?couple",
    text: "ShadiApp helped us find true love across cultures. We're grateful for this platform!"
  }
]; 