import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Divider, CircularProgress, Button, Snackbar } from '@mui/material';
import axios from '../../app/axios';
import { useNavigate } from 'react-router-dom';
import convertPrice from '../../utils/convertPrice';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('/booking/history', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.data.success) {
                    setBookings(response.data.payload.bookings);
                    setError(null);
                } else {
                    setError('Failed to fetch bookings.');
                }
            } catch (err) {
                setError('Failed to fetch bookings.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await axios.delete(`/booking/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data.success) {
                setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
                setSuccessMessage('Booking canceled successfully.');
            } else {
                setError('Failed to cancel booking.');
            }
        } catch (err) {
            setError('Failed to cancel booking.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Bookings
            </Typography>

            {error && (
                <Typography color="error" gutterBottom>
                    {error}
                </Typography>
            )}

            {bookings.length === 0 ? (
                <Typography variant="h6" gutterBottom>
                    No bookings found.
                </Typography>
            ) : (
                <List>
                    {bookings.map(booking => (
                        <ListItem key={booking.id} sx={{ p: 0 }}>
                            <Box sx={{ width: '100%', borderBottom: '1px solid #e0e0e0', py: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6">
                                        {booking.room?.name || 'Room Name'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/bookings/${booking.id}`)}>
                                            View Details
                                        </Button>
                                        <Button variant="outlined" color="secondary" size="small" onClick={() => handleCancelBooking(booking.id)}>
                                            Cancel Booking
                                        </Button>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="body1" color="text.secondary">
                                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" color="primary">
                                            {convertPrice(booking.totalPrice || 0)} VND
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Status: {booking.status}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider />
                        </ListItem>
                    ))}
                </List>
            )}

            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage(null)}>
                <Alert onClose={() => setSuccessMessage(null)} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BookingsPage;