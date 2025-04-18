import bookingService from '../services/booking.service.js';

export default {
    async cancelBooking(req, res) {
        const { bookingId } = req.params;
        const userId = req.user.id;

        try {
            const affectedRows = await bookingService.cancelBooking(bookingId, userId);

            if (affectedRows === 1) {
                return res.status(200).json({
                    success: true,
                    message: 'Booking cancelled successfully',
                    payload: null
                });
            }

            res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: 'Failed to cancel booking'
                }
            });

        } catch (error) {
            console.error('Error cancelling booking:', error.message);
            
            if (error.message === 'Unauthorized to cancel this booking') {
                res.status(401).json({
                    success: false,
                    error: {
                        code: 401,
                        message: error.message
                    }
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: {
                        code: 500,
                        message: 'Internal server error'
                    }
                });
            }
        }
    }
};