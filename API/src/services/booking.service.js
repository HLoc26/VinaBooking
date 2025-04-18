import BookingDAO from '../dao/booking.dao.js';
import { EBookingStatus } from '../../classes/Booking.js';

class BookingService {
  constructor() {
    this.bookingDAO = new BookingDAO();
  }

  async cancelBooking(bookingId, userId) {
    try {
      // Find the booking by ID
      const booking = await this.bookingDAO.findOne(bookingId);
      
      if (!booking) {
        return {
          success: false,
          error: {
            code: 404,
            message: 'Booking not found'
          }
        };
      }

      // Check if the user is authorized to cancel this booking
      if (booking.userId !== userId) {
        return {
          success: false,
          error: {
            code: 401,
            message: 'Unauthorized to cancel this booking'
          }
        };
      }

      // Cancel the booking
      const canceledBooking = await this.bookingDAO.cancelBooking(bookingId);

      return {
        success: true,
        message: 'Booking canceled successfully',
        payload: canceledBooking
      };

    } catch (error) {
      console.error('Error canceling booking:', error.message);
      return {
        success: false,
        error: {
          code: 500,
          message: 'Failed to cancel booking'
        }
      };
    }
  }
}

export default BookingService;