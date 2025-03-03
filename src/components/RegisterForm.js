/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from "react";
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
  // Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Email,
  Lock,
  Person,
  LocationOn,
  ChevronRight,
  ChevronLeft,
  // CloudUpload,
  Delete,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import styles from "../styles/RegisterForm.module.css";
import { toast } from "react-toastify";
import { RELIGIONS, OCCUPATIONS } from "../utils/constants";
import { BASE_URL } from "../utils/base";

const steps = ["Basic Info", "Personal Details", "Photos", "Preferences"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function RegisterForm(props) {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    religion: "",
    occupation: "",
    location: "",
    about: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [postPictures, setPostPictures] = useState([]);
  const [postPicturesPreviews, setPostPicturesPreviews] = useState([]);

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 0:
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
          newErrors.email = "Invalid email format";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6)
          newErrors.password = "Password must be at least 6 characters";
        break;
      case 1:
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
        break;
      case 2:
        if (!profilePicture)
          newErrors.profilePicture = "Profile picture is required";
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
        toast.error("Profile picture must be less than 5MB");
        return;
      }
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const onPostPicturesDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length + postPictures.length > 4) {
        toast.error("Maximum 4 post pictures allowed");
        return;
      }

      const validFiles = acceptedFiles.filter(
        (file) => file.size <= MAX_FILE_SIZE
      );
      if (validFiles.length !== acceptedFiles.length) {
        toast.warning("Some files were skipped as they exceed 5MB size limit");
      }

      setPostPictures((prevPhotos) => [...prevPhotos, ...validFiles]);
      setPostPicturesPreviews((prevPreviews) => [
        ...prevPreviews,
        ...validFiles.map((file) => URL.createObjectURL(file)),
      ]);
    },
    [postPictures]
  );

  const removePostPicture = (index) => {
    setPostPictures((prev) => prev.filter((_, i) => i !== index));
    setPostPicturesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onPostPicturesDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
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
      // Show first error as toast
      const firstError = Object.values(stepErrors)[0];
      toast.error(firstError);
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
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add profile picture first
      if (profilePicture) {
        console.log("Adding profile picture:", profilePicture); // Debug log
        formDataToSend.append("profilePicture", profilePicture);
      }
      
      // Add post pictures
      if (postPictures.length > 0) {
        console.log("Adding post pictures:", postPictures); // Debug log
      postPictures.forEach((photo) => {
        formDataToSend.append("postPictures", photo);
      });
      }

      // Log the FormData contents
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(`${BASE_URL}/api/auth/register`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Registration response:", response.data); // Debug log
      localStorage.setItem("token", response.data.token);
      toast.success("Registration successful!");
      
      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed");
      setErrors({
        submit: error.response?.data?.message || "Registration failed",
      });
      props.onSubmitStart?.(false);
    }
  };

  const handleKeyDown = (e) => {
    // Prevent form submission and next step on Enter key
    if (e.key === "Enter") {
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
                <Person sx={{ fontSize: 60, color: "primary.main" }} />
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={!!errors.password}
                helperText={errors.password}
                required
                InputProps={{
                  startAdornment: (
                    <Lock color="action" />
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
                InputProps={{
                  startAdornment: (
                    <Person color="action" />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
                InputProps={{
                  startAdornment: (
                    <Person color="action" />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!!errors.gender}>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )
      case 2:
        return renderPhotoUploadStep()
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Religion (Optional)</InputLabel>
                <Select
                  value={formData.religion}
                  label="Religion"
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                >
                  {RELIGIONS.map((religion) => (
                    <MenuItem key={religion} value={religion}>
                      {religion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Occupation (Optional)</InputLabel>
                <Select
                  value={formData.occupation}
                  label="Occupation"
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                >
                  {OCCUPATIONS.map((occupation) => (
                    <MenuItem key={occupation} value={occupation}>
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
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        )
      default:
        return null
    }
  }

  return (
    <Box className={styles.formContainer}>
      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box component="form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<ChevronLeft />}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  endIcon={<ChevronRight />}
                >
                  Submit
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  endIcon={<ChevronRight />}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}