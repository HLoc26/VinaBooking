import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Stack, 
  CircularProgress, 
  Alert, 
  Divider,
  Grid
} from '@mui/material';
import axiosInstance from '../../app/axios';
import FavoriteCard from '../../components/ui/FavoriteCard/FavoriteCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorite list when component mounts
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/favourite');
        
        if (response.data.success) {
          setFavorites(response.data.payload.accommodations || []);
        } else {
          setError(response.data.error.message || 'Failed to load favorites');
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setError('Error loading your saved accommodations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Handle removing an accommodation from favorites
  const handleRemoveFromFavorites = async (accommodationId) => {
    try {
      const response = await axiosInstance.delete(`/favourite/remove/${accommodationId}`);
      
      if (response.data.success) {
        // Update local state to reflect the removal
        setFavorites(favorites.filter(accommodation => accommodation.id !== accommodationId));
      } else {
        setError(response.data.error.message || 'Failed to remove from favorites');
      }
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Error removing accommodation from favorites. Please try again.');
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
    </Container>
  );
};

export default FavoritesPage;