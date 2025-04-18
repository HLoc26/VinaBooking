import Booking from '../database/models/Booking.model.js';
import { EBookingStatus } from '../../classes/Booking.js';

class BookingDAO {
  async findOne(bookingId) {
    try {
      const booking = await Booking.findOne({
        where: { id: bookingId }
      });
      if (!booking) {
        return {
          success: false,
          error: {
            code: 404,
            message: 'Booking not found'
          }
        };
      }
      return {
        success: true,
        message: 'Booking found successfully',
        payload: booking
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 500,
          message: 'Failed to find booking'
        }
      };
    }
  }

  async cancelBooking(bookingId) {
    try {
      const result = await Booking.update({
        status: EBookingStatus.CANCELED
      }, {
        where: { id: bookingId }
      });
      if (result[0] === 0) {
        return {
          success: false,
          error: {
            code: 404,
            message: 'Booking not found or already canceled'
          }
        };
      }
      return {
        success: true,
        message: 'Booking canceled successfully',
        payload: result[0]
      };
    } catch (error) {
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

export default BookingDAO;