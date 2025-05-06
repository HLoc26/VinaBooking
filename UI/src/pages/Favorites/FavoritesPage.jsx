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
import axiosInstance from '../../app/axios';
import FavoriteCard from '../../components/ui/FavoriteCard/FavoriteCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch favorite list when component mounts
  const fetchFavorites = async () => {
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
    fetchFavorites();
  }, []);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle removing an accommodation from favorites
  const handleRemoveFromFavorites = async (accommodationId) => {
    try {
      // Don't set loading to true here as it clears the whole favorites list from view
      // Instead, we could add a local loading state if needed
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
        // Only set error and show error message if the API returns an error
        setError(response.data.error?.message || 'Failed to remove from favorites');
        setSnackbar({
          open: true,
          message: response.data.error?.message || 'Failed to remove from favorites',
          severity: 'error'
        });
      }
    } catch (err) {
      // This block only executes when there's a network error or other exception
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Your Saved Accommodations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your favorite accommodations
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>
      
      {loading ? (
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
  );
};

export default FavoritesPage;