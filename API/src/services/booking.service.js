import { bookingRepo } from "../database/repository/index.js";
import { EBookingStatus } from "../classes/Booking.js";

export default {
    /**
     * Get bookings for a specific accommodation owner
     * @param {number} ownerId - The owner's user ID
     * @param {string} status - Optional status filter
     * @returns {Array} Array of booking objects
     */
    async getOwnerBookings(ownerId, status = null) {
        try {
            const bookings = await bookingRepo.findBookingsByOwner(ownerId, status);
            return bookings;
        } catch (error) {
            console.error("Error fetching owner bookings:", error);
            return [];
        }
    },

    /**
     * Get a specific booking by ID for an owner
     * @param {number} bookingId - The booking ID
     * @param {number} ownerId - The owner's user ID
     * @returns {Object|null} Booking object or null if not found
     */
    async getOwnerBookingById(bookingId, ownerId) {
        try {
            const booking = await bookingRepo.findBookingByIdForOwner(bookingId, ownerId);
            return booking;
        } catch (error) {
            console.error("Error fetching owner booking by ID:", error);
            return null;
        }
    },

    /**
     * Search bookings by ID for an owner
     * @param {number} bookingId - The booking ID to search for
     * @param {number} ownerId - The owner's user ID
     * @returns {Array} Array containing the found booking or empty array
     */
    async searchOwnerBookings(bookingId, ownerId) {
        try {
            const booking = await bookingRepo.findBookingByIdForOwner(bookingId, ownerId);
            return booking ? [booking] : [];
        } catch (error) {
            console.error("Error searching owner bookings:", error);
            return [];
        }
    },

    /**
     * Update booking status
     * @param {number} bookingId - The booking ID to update
     * @param {string} status - The new status
     * @param {number} ownerId - The owner's user ID
     * @returns {Object} Object with success flag and message
     */
    async updateBookingStatus(bookingId, status, ownerId) {
        try {
            // Check if booking belongs to this owner
            const booking = await bookingRepo.findBookingByIdForOwner(bookingId, ownerId);
            
            if (!booking) {
                return {
                    success: false,
                    message: "Booking not found or does not belong to this owner"
                };
            }

            // Check if the status transition is valid
            if (!this.isValidStatusTransition(booking.status, status)) {
                return {
                    success: false,
                    message: `Invalid status transition from ${booking.status} to ${status}`
                };
            }

            // Update booking status
            const updated = await bookingRepo.updateBookingStatus(bookingId, status);
            
            if (!updated) {
                return {
                    success: false,
                    message: "Failed to update booking status"
                };
            }

            return {
                success: true,
                message: `Booking status successfully updated to ${status}`
            };
        } catch (error) {
            console.error("Error updating booking status:", error);
            return {
                success: false,
                message: "An error occurred while updating booking status"
            };
        }
    },

    /**
     * Check if a status transition is valid
     * @param {string} currentStatus - The current status
     * @param {string} newStatus - The new status
     * @returns {boolean} Whether the transition is valid
     */
    isValidStatusTransition(currentStatus, newStatus) {
        // Define valid status transitions
        const validTransitions = {
            [EBookingStatus.BOOKED]: [EBookingStatus.RESERVED, EBookingStatus.CANCELED],
            [EBookingStatus.RESERVED]: [EBookingStatus.CHECKED_IN, EBookingStatus.CANCELED],
            [EBookingStatus.CHECKED_IN]: [EBookingStatus.COMPLETED, EBookingStatus.CANCELED],
            [EBookingStatus.COMPLETED]: [], // Terminal state, no transitions
            [EBookingStatus.CANCELED]: []   // Terminal state, no transitions
        };

        // Check if the transition is valid
        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }
};