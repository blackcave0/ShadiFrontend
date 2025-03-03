import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  CheckCircle,
  Block,
  PauseCircle,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AdminDashboard.module.css';
import { BASE_URL } from '../utils/base';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.message || 'Failed to fetch statistics');
      setLoading(false);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchStats();
    // Set up polling for real-time updates
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Registrations'
      }
    }
  };

  const chartData = stats?.dailyTrends ? {
    labels: stats.dailyTrends.map(item => item.date),
    datasets: [
      {
        label: 'New Users',
        data: stats.dailyTrends.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  } : null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Status Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.statsCard}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h3">
                {stats?.totalUsers || 0}
              </Typography>
              <Person className={styles.statsIcon} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.statsCard}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h3">
                {stats?.usersByStatus?.active || 0}
              </Typography>
              <CheckCircle className={styles.statsIcon} color="success" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.statsCard}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Inactive Users
              </Typography>
              <Typography variant="h3">
                {stats?.usersByStatus?.inactive || 0}
              </Typography>
              <PauseCircle className={styles.statsIcon} color="warning" />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.statsCard}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Suspended Users
              </Typography>
              <Typography variant="h3">
                {stats?.usersByStatus?.suspended || 0}
              </Typography>
              <Block className={styles.statsIcon} color="error" />
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          <Paper className={styles.chartPaper} sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Registration Trends
            </Typography>
            {chartData && (
              <Box sx={{ height: 'calc(100% - 40px)' }}>
                <Line options={chartOptions} data={chartData} />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 