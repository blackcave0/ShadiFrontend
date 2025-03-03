import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Delete,
  Edit,
  Visibility,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ErrorBoundary from '../components/ErrorBoundary';
import { BASE_URL } from '../utils/base';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${BASE_URL}/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers(); // Refresh the list
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleEdit = async (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleView = async (userId) => {
    try {
      setError('');
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${BASE_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setSelectedUser(response.data);
        setEditMode(false);
        setOpenDialog(true);
      } else {
        toast.error('No user data received');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch user details';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleUpdate = async () => {
    try {
      setError('');
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${BASE_URL}/api/admin/users/${selectedUser._id}`,
        {
          email: selectedUser.email,
          status: selectedUser.status,
          profile: selectedUser.profile,
          preferences: selectedUser.preferences
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        setOpenDialog(false);
        fetchUsers();
        toast.success('User updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${BASE_URL}/api/admin/users/${userId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
      
      toast.success('User status updated successfully');
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const UserDetailsView = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Basic Info" />
          <Tab label="Profile Details" />
          <Tab label="Preferences" />
          <Tab label="Matches" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Basic Information</Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography><strong>Name:</strong> {selectedUser?.profile?.firstName} {selectedUser?.profile?.lastName}</Typography>
                  <Typography><strong>Email:</strong> {selectedUser?.email}</Typography>
                  <Typography><strong>Status:</strong> {selectedUser?.status || 'Active'}</Typography>
                  <Typography><strong>Joined:</strong> {new Date(selectedUser?.createdAt).toLocaleDateString()}</Typography>
                  <Typography><strong>Last Active:</strong> {selectedUser?.lastActive}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Profile Details</Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography><strong>Gender:</strong> {selectedUser?.profile?.gender || 'Not specified'}</Typography>
                  <Typography><strong>Date of Birth:</strong> {selectedUser?.profile?.dateOfBirth || 'Not specified'}</Typography>
                  <Typography><strong>Age:</strong> {selectedUser?.profile?.age || 'Not specified'}</Typography>
                  <Typography><strong>Location:</strong> {selectedUser?.profile?.location || 'Not specified'}</Typography>
                  <Typography><strong>Occupation:</strong> {selectedUser?.profile?.occupation || 'Not specified'}</Typography>
                  <Typography><strong>Religion:</strong> {selectedUser?.profile?.religion || 'Not specified'}</Typography>
                  <Typography><strong>Education:</strong> {selectedUser?.profile?.education || 'Not specified'}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom><strong>About:</strong></Typography>
                  <Typography>{selectedUser?.profile?.about || 'No description provided'}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Preferences</Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography><strong>Age Range:</strong> {selectedUser?.preferences?.ageRange?.min || 'Any'} - {selectedUser?.preferences?.ageRange?.max || 'Any'}</Typography>
                  <Typography><strong>Location Preference:</strong> {selectedUser?.preferences?.location || 'Any'}</Typography>
                  <Typography><strong>Religion Preference:</strong> {selectedUser?.preferences?.religion || 'Any'}</Typography>
                  {/* Add more preferences as needed */}
                </Box>
              </Grid>
            </Grid>
          )}

          {activeTab === 3 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Matches</Typography>
                <Box sx={{ pl: 2 }}>
                  {selectedUser?.matches?.length > 0 ? (
                    selectedUser.matches.map((match, index) => (
                      <Box key={match._id} sx={{ mb: 2 }}>
                        <Typography><strong>Match {index + 1}:</strong> {match.profile?.firstName} {match.profile?.lastName}</Typography>
                        <Typography sx={{ pl: 2 }}>Email: {match.email}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography>No matches found</Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Grid>
    </Grid>
  );

  const EditUserForm = () => (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Basic Information</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={selectedUser?.profile?.firstName || ''}
            onChange={(e) => setSelectedUser({
              ...selectedUser,
              profile: {
                ...selectedUser.profile,
                firstName: e.target.value
              }
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={selectedUser?.profile?.lastName || ''}
            onChange={(e) => setSelectedUser({
              ...selectedUser,
              profile: {
                ...selectedUser.profile,
                lastName: e.target.value
              }
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser({
              ...selectedUser,
              email: e.target.value
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedUser?.status || 'active'}
              onChange={(e) => setSelectedUser({
                ...selectedUser,
                status: e.target.value
              })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Profile Details</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location"
            value={selectedUser?.profile?.location || ''}
            onChange={(e) => setSelectedUser({
              ...selectedUser,
              profile: {
                ...selectedUser.profile,
                location: e.target.value
              }
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Occupation"
            value={selectedUser?.profile?.occupation || ''}
            onChange={(e) => setSelectedUser({
              ...selectedUser,
              profile: {
                ...selectedUser.profile,
                occupation: e.target.value
              }
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Religion"
            value={selectedUser?.profile?.religion || ''}
            onChange={(e) => setSelectedUser({
              ...selectedUser,
              profile: {
                ...selectedUser.profile,
                religion: e.target.value
              }
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Education"
            value={selectedUser?.profile?.education || ''}
            onChange={(e) => setSelectedUser({
              ...selectedUser,
              profile: {
                ...selectedUser.profile,
                education: e.target.value
              }
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="About"
            value={selectedUser?.profile?.about || ''}
            onChange={(e) => setSelectedUser({
              ...selectedUser,
              profile: {
                ...selectedUser.profile,
                about: e.target.value
              }
            })}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <ErrorBoundary>
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          User Management
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    {user.profile.firstName} {user.profile.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={user.status || 'active'}
                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="suspended">Suspended</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(user._id)}>
                      <Visibility />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editMode ? 'Edit User' : 'User Details'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {editMode ? <EditUserForm /> : <UserDetailsView />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              {editMode ? 'Cancel' : 'Close'}
            </Button>
            {editMode && (
              <Button onClick={handleUpdate} variant="contained" color="primary">
                Save Changes
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
    </ErrorBoundary>
  );
};

export default UserManagement; 