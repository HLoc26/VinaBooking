import { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import axiosInstance from '../../../app/axios';

/**
 * A reusable favorite button component that can be used to add/remove accommodations from favorites
 * @param {Object} props Component props
 * @param {number} props.accommodationId The ID of the accommodation
 * @param {boolean} props.initialIsFavorite Whether the accommodation is initially in favorites
 * @param {function} props.onToggle Optional callback when favorite status changes
 * @returns {JSX.Element} FavoriteButton component
 */
const FavoriteButton = ({ accommodationId, initialIsFavorite = false, onToggle, ...props }) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle adding to favorites
  const addToFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.post('/favourite/add', {
        accommodationId
      });
      
      if (response.data.success) {
        setIsFavorite(true);
        if (onToggle) onToggle(true);
      } else {
        setError(response.data.error?.message || 'Failed to add to favorites');
      }
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError(err.response?.data?.error?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing from favorites
  const removeFromFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.delete(`/favourite/remove/${accommodationId}`);
      
      if (response.data.success) {
        setIsFavorite(false);
        if (onToggle) onToggle(false);
      } else {
        setError(response.data.error?.message || 'Failed to remove from favorites');
      }
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError(err.response?.data?.error?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async () => {
    if (isLoading) return;
    
    if (isFavorite) {
      await removeFromFavorites();
    } else {
      await addToFavorites();
    }
  };

  return (
    <Tooltip 
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      placement="top"
    >
      <IconButton
        onClick={handleToggleFavorite}
        disabled={isLoading}
        color={error ? "error" : "primary"}
        {...props}
      >
        {isFavorite ? <Favorite /> : <FavoriteBorder />}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;