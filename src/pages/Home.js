import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  // Divider
} from '@mui/material';
import { 
  Favorite,
  Security,
  People,
  Verified,
  Search,
  Chat
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.css';
// import { alpha } from '@mui/material/styles';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.root}>
      {/* Hero Section */}
      <Box className={styles.heroSection}>
        <Box className={styles.heroImageContainer}>
          {/* <img 
            // src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=80&fit=crop"
            src='https://res.cloudinary.com/do1sonzbq/image/upload/v1736801088/shadiapp_HeroImages/ehqbwquwi07swxwjhqu1.jpg'
            alt="Wedding Couple"
            className={styles.heroImage}
          />  */}
          <Box className={styles.heroOverlay} />
        </Box>
        <Container 
          maxWidth="lg" 
          sx={{ 
            position: 'relative', 
            zIndex: 2,
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <Grid 
            container 
            spacing={{ xs: 2, md: 6 }} 
            alignItems="center"
          >
            <Grid 
              item 
              xs={12} 
              md={8} 
              sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                px: { xs: 1, sm: 2, md: 3 }
              }}
            >
              <Typography 
                variant="h1" 
                className={styles.heroTitle}
                sx={{ wordBreak: 'break-word' }}
              >
                Find Your <span className={styles.highlight}>Perfect Match</span>
              </Typography>
              <Typography 
                variant="h5" 
                className={styles.heroSubtitle}
                sx={{ px: { xs: 1, sm: 0 } }}
              >
                Join millions of happy couples who found their soulmate with ShadiApp
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 3 }}
                mt={{ xs: 3, sm: 6 }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{ width: '100%' }}
              >
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/register')}
                  className={styles.registerButton}
                  // fullWidth={matches}
                >
                  Get Started Now
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/login')}
                  className={styles.loginButton}
                  // fullWidth={matches}
                >
                  Sign In
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box className={styles.featuresSection}>
        <Container maxWidth="lg">
          <Typography variant="h2" className={styles.sectionTitle} align="center">
            Why Choose <span className={styles.highlight}>ShadiApp</span>?
          </Typography>
          <Grid container spacing={4} mt={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className={styles.featureCard}>
                  <Box className={styles.featureIcon}>
                    {feature.icon}
                  </Box>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Success Stories */}
      <Box className={styles.storiesSection}>
        <Container maxWidth="lg">
          <Typography variant="h3" className={styles.sectionTitle} align="center">
            Success Stories
          </Typography>
          <Grid container spacing={4} mt={4}>
            {successStories.map((story, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className={styles.storyCard}>
                  <CardMedia
                    component="img"
                    height="350"
                    image={story.image}
                    alt={story.couple}
                    className={styles.storyImage}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {story.couple}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {story.story}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box className={styles.statsSection}>
        <Container maxWidth="lg">
          <Grid container spacing={4} className={styles.statsContainer}>
            {statistics.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box className={styles.statBox}>
                  <Typography variant="h2" className={styles.statNumber}>
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" className={styles.statLabel}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Add this before the CTA section */}
      <WeddingGallery />

      {/* Call to Action */}
      <Box className={styles.ctaSection}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to Find Your Soulmate?
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Join ShadiApp today and start your journey to finding true love
          </Typography>
          <Box textAlign="center">
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              className={styles.ctaButton}
            >
              Create Your Profile
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

const features = [
  {
    icon: <Security fontSize="large" />,
    title: "Safe & Secure",
    description: "Advanced security measures to protect your privacy and personal information"
  },
  {
    icon: <Search fontSize="large" />,
    title: "Smart Matching",
    description: "Advanced algorithms to find your perfect match based on compatibility"
  },
  {
    icon: <Verified fontSize="large" />,
    title: "Verified Profiles",
    description: "All profiles are manually verified to ensure authentic connections"
  },
  {
    icon: <Chat fontSize="large" />,
    title: "Easy Communication",
    description: "Seamless chat features to help you connect with potential matches"
  },
  {
    icon: <People fontSize="large" />,
    title: "Large Community",
    description: "Join millions of users looking for meaningful relationships"
  },
  {
    icon: <Favorite fontSize="large" />,
    title: "Success Stories",
    description: "Thousands of successful marriages and happy couples"
  }
];

const successStories = [
  {
    couple: "Priya & Rahul",
    image:
      "https://res.cloudinary.com/do1sonzbq/image/upload/v1740954309/shadiapp_HeroImages/s0psgwjmlqdoor8kzp84.jpg",
    story:
      "Met through truematrimonial app in 2024 and got married within 6 months. It was love at first sight!",
  },
  {
    couple: "Anoop & Namrata",
    image:
      "https://res.cloudinary.com/do1sonzbq/image/upload/v1740954257/shadiapp_HeroImages/bvqp0tsgm1dukjierojl.jpg",
    story:
      "Found each other despite living in different cities. Now happily married for 1 year.",
  },
  {
    couple: "Meera & Arun",
    image:
      "https://res.cloudinary.com/do1sonzbq/image/upload/v1740954161/shadiapp_HeroImages/w7g12pyt87ea8bpqupbc.jpg",
    story:
      "Connected over shared interests and values. Celebrating 2 years of marriage!",
  },
];

const statistics = [
  { number: "1M+", label: "Active Users" },
  { number: "10K+", label: "Successful Marriages" },
  { number: "500K+", label: "Monthly Matches" },
  { number: "4.8★", label: "User Rating" }
];

// Optional: Add a new section to showcase more wedding photos
const WeddingGallery = () => (
  <Box className={styles.gallerySection}>
    <Container maxWidth="lg">
      <Typography variant="h3" className={styles.sectionTitle} align="center">
        Beautiful Moments
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800"
            alt="Wedding Moment"
            className={styles.galleryImage}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <img 
                src="https://images.unsplash.com/photo-1549417229-7686ac5595fd?w=400"
                alt="Couple Moment"
                className={styles.galleryImage}
              />
            </Grid>
            <Grid item xs={6}>
              <img 
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400"
                alt="Wedding Celebration"
                className={styles.galleryImage}
              />
            </Grid>
            <Grid item xs={12}>
              <img 
                src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800"
                alt="Happy Couple"
                className={styles.galleryImage}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default Home; 