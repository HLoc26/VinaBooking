import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Stack, 
  CircularProgress, 
  Alert, 
  Divider,
  Grid,
  Snackbar
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import axiosInstance from '../../app/axios';
import FavoriteCard from '../../components/ui/FavoriteCard/FavoriteCard';
import Navbar from '../../components/layout/NavBar/NavBar';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [initialLoad, setInitialLoad] = useState(true);
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { isLoggedIn, loading: authLoading, user } = useSelector((state) => state.auth);

  // Fetch favorite list when component mounts
  const fetchFavorites = async () => {
    if (!isLoggedIn || !user) {
      // Don't fetch if not logged in
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/favourite');
      
      if (response.data.success) {
        setFavorites(response.data.payload.accommodations || []);
      } else {
        setError(response.data.error?.message || 'Failed to load favorites');
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Error loading your saved accommodations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // This effect runs once after the first render to set initial load to false
    const timer = setTimeout(() => setInitialLoad(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only fetch data when authenticated and auth loading is complete
    if (!authLoading && isLoggedIn && user) {
      fetchFavorites();
    }
  }, [isLoggedIn, authLoading, user]);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle removing an accommodation from favorites
  const handleRemoveFromFavorites = async (accommodationId) => {
    try {
      const response = await axiosInstance.delete(`/favourite/remove/${accommodationId}`);
      
      if (response.data.success) {
        // Update state to remove the item without a full reload
        setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== accommodationId));
        setSnackbar({
          open: true,
          message: 'Accommodation removed from favorites',
          severity: 'success'
        });
      } else {
        setError(response.data.error?.message || 'Failed to remove from favorites');
        setSnackbar({
          open: true,
          message: response.data.error?.message || 'Failed to remove from favorites',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error removing from favorites:', err);
      const errorMessage = err.response?.data?.error?.message || 'Error removing accommodation from favorites. Please try again.';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  // Show a loading state if either authentication is loading or favorites are loading
  const isPageLoading = authLoading || loading;

  // Check if we have an auth token in localStorage
  const hasAuthToken = () => {
    return !!localStorage.getItem('token');
  };

  // During initial load or when auth is still loading, show loading spinner instead of redirecting
  if (initialLoad || authLoading) {
    return (
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  // Only redirect to login if the auth loading has completed AND user is not logged in
  // AND there's no token in storage (to handle page reloads before redux is ready)
  if (!isLoggedIn && !hasAuthToken()) {
    return <Navigate to="/login" state={{ from: '/favorites' }} replace />;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Your Saved Accommodations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your favorite accommodations
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>
        
        {isPageLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : favorites.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" gutterBottom>
              You don't have any saved accommodations yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              When you find places you like, save them here for easy access
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {favorites.map((accommodation) => (
              <FavoriteCard
                key={accommodation.id}
                accommodation={accommodation}
                onRemove={() => handleRemoveFromFavorites(accommodation.id)}
              />
            ))}
          </Stack>
        )}

        {/* Notification Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Container>
    </>
  );
};

export default FavoritesPage;