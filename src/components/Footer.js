import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  IconButton, 
  Link,
  Divider 
} from '@mui/material';
import {
  Instagram,
  Email,
  Phone,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp
} from '@mui/icons-material';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <Box className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box className={styles.companyInfo}>
              <Typography variant="h6" className={styles.title}>
                ShadiApp
              </Typography>
              <Typography variant="body2" className={styles.description}>
                Find your perfect match with India's most trusted matrimony service.
              </Typography>
              <Box className={styles.socialIcons}>
                <IconButton 
                  href="https://instagram.com" 
                  target="_blank"
                  className={styles.socialIcon}
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  href="mailto:contact@shadiapp.com"
                  className={styles.socialIcon}
                >
                  <Email />
                </IconButton>
                <IconButton 
                  href="https://facebook.com" 
                  target="_blank"
                  className={styles.socialIcon}
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  href="https://twitter.com" 
                  target="_blank"
                  className={styles.socialIcon}
                >
                  <Twitter />
                </IconButton>
                <IconButton 
                  href="https://linkedin.com" 
                  target="_blank"
                  className={styles.socialIcon}
                >
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" className={styles.title}>
              Quick Links
            </Typography>
            <Box className={styles.links}>
              <Link href="/about" className={styles.link}>About Us</Link>
              <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
              <Link href="/terms" className={styles.link}>Terms & Conditions</Link>
              <Link href="/faq" className={styles.link}>FAQ</Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" className={styles.title}>
              Contact Us
            </Typography>
            <Box className={styles.contactInfo}>
              <Box className={styles.contactItem}>
                <Email className={styles.contactIcon} />
                <Typography>contact@shadiapp.com</Typography>
              </Box>
              <Box className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <Typography>+91 123 456 7890</Typography>
              </Box>
              <Box className={styles.contactItem}>
                <WhatsApp className={styles.contactIcon} />
                <Typography>+91 987 654 3210</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider className={styles.divider} />

        <Box className={styles.bottom}>
          <Typography variant="body2" className={styles.copyright}>
            © {new Date().getFullYear()} ShadiApp. All rights reserved.
          </Typography>
          <Box className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.bottomLink}>Privacy</Link>
            <Link href="/terms" className={styles.bottomLink}>Terms</Link>
            <Link href="/sitemap" className={styles.bottomLink}>Sitemap</Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 