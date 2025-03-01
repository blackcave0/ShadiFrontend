import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem,
  Container,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  // const pathname = useLocation().pathname;
  // console.log(pathname);
  const {  logout,  } = useAuth();
  const { admin, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (path) => {
    setMobileOpen(false);
    setAdminMenuAnchor(null);
    navigate(path);
  };

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };

  const handleAdminLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const AdminMenu = () => (
    <>
      <Button
        className={styles.adminButton}
        onClick={handleAdminMenuOpen}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<AdminPanelSettingsIcon />}
      >
        Admin Panel
      </Button>
      <Menu
        anchorEl={adminMenuAnchor}
        open={Boolean(adminMenuAnchor)}
        onClose={handleAdminMenuClose}
        className={styles.adminMenu}
      >
        <MenuItem onClick={() => handleNavClick('/admin')}>Dashboard</MenuItem>
        <MenuItem onClick={() => handleNavClick('/admin/users')}>User Management</MenuItem>
        <MenuItem onClick={() => handleNavClick('/admin/matches')}>Match Management</MenuItem>
        <Divider />
        <MenuItem onClick={() => handleNavClick('/admin/settings')}>Admin Settings</MenuItem>
      </Menu>
    </>
  );

  const NavLinks = ({ mobile = false }) => (
    <Box className={mobile ? styles.mobileNavLinks : styles.navLinks}>
      {admin ? (
        <>
          <Button
            className={mobile ? styles.mobileNavButton : styles.navButton}
            onClick={() => handleNavClick('/admin')}
            fullWidth={mobile}
          >
            Dashboard
          </Button>
          <Button
            className={mobile ? styles.mobileNavButton : styles.navButton}
            onClick={() => handleNavClick('/admin/users')}
            fullWidth={mobile}
          >
            Users
          </Button>
          <Button
            className={mobile ? styles.mobileNavButton : styles.navButton}
            onClick={handleAdminLogout}
            fullWidth={mobile}
          >
            Logout
          </Button>
        </>
      ) : isAuthenticated ? (
        <>
          <Button
            className={mobile ? styles.mobileNavButton : styles.navButton}
            onClick={() => handleNavClick('/matches')}
            fullWidth={mobile}
          >
            Matches
          </Button>
          <Button
            className={mobile ? styles.mobileNavButton : styles.navButton}
            onClick={() => handleNavClick('/profile')}
            fullWidth={mobile}
          >
            Profile
          </Button>
          <Button
            className={mobile ? styles.mobileNavButton : styles.navButton}
            onClick={handleLogout}
            fullWidth={mobile}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button
            className={mobile ? styles.mobileNavButton : styles.navButton}
            onClick={() => handleNavClick('/login')}
            fullWidth={mobile}
          >
            Login
          </Button>
          <Button
            className={mobile ? styles.mobileNavButton : styles.navButton}
            onClick={() => handleNavClick('/register')}
            fullWidth={mobile}
            variant={mobile ? "text" : "contained"}
            color="secondary"
          >
            Register
          </Button>
        </>
      )}
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static"
        className={styles.navbar}
        elevation={1}
      >
        <Container maxWidth="lg">
          <Toolbar className={styles.navbarContainer}>
            <Box 
              component="div" 
              className={styles.logo} 
              onClick={() => handleNavClick('/')}
              sx={{ cursor: 'pointer' }}
            >
              <FavoriteIcon sx={{ 
                fontSize: 28,
                filter: 'drop-shadow(0 2px 4px rgba(129, 191, 218, 0.3))',
                color: '#FADA7A'
              }} /> 
              <span className={styles.logoText}>ShadiApp</span>
            </Box>

            <NavLinks />

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={styles.mobileMenu}
              sx={{ 
                color: '#2C3E50',
                '&:hover': { 
                  background: 'rgba(177, 240, 247, 0.2)' 
                } 
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        classes={{
          paper: styles.drawerPaper
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box className={styles.drawerContainer}>
          <List>
            <ListItem className={styles.drawerHeader}>
              <FavoriteIcon className={styles.drawerLogo} />
              <span className={styles.drawerLogoText}>ShadiApp</span>
            </ListItem>
            <NavLinks mobile />
            {/* <AdminMenu /> */}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar; 