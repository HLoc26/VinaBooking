import bookingService from "../services/booking.service.js";
import { EBookingStatus } from "../classes/Booking.js";

export default {
    /**
     * Get all bookings for an accommodation owner
     * Can be filtered by status
     */
    async getOwnerBookings(req, res) {
        try {
            const ownerId = req.user?.id;
            const { status } = req.query;
            
            const bookings = await bookingService.getOwnerBookings(ownerId, status);
            
            return res.status(200).json({
                success: true,
                message: `Retrieved ${bookings.length} bookings`,
                payload: bookings
            });
        } catch (error) {
            console.error("Error retrieving owner bookings:", error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: "Internal Server Error"
                }
            });
        }
    },
    
    /**
     * Get details of a specific booking by ID
     */
    async getBookingDetails(req, res) {
        try {
            const ownerId = req.user?.id;
            const bookingId = parseInt(req.params.id);
            
            if (isNaN(bookingId) || bookingId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: "Invalid booking ID"
                    }
                });
            }
            
            const booking = await bookingService.getOwnerBookingById(bookingId, ownerId);
            
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 404,
                        message: "Booking not found or does not belong to this owner"
                    }
                });
            }
            
            return res.status(200).json({
                success: true,
                message: "Booking details retrieved successfully",
                payload: booking
            });
        } catch (error) {
            console.error("Error retrieving booking details:", error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: "Internal Server Error"
                }
            });
        }
    },
    
    /**
     * Search bookings by ID
     */
    async searchBookings(req, res) {
        try {
            const ownerId = req.user?.id;
            const { bookingId } = req.query;
            
            if (!bookingId) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: "Booking ID is required for search"
                    }
                });
            }
            
            const parsedBookingId = parseInt(bookingId);
            const bookings = await bookingService.searchOwnerBookings(parsedBookingId, ownerId);
            
            return res.status(200).json({
                success: true,
                message: `Found ${bookings.length} bookings`,
                payload: bookings
            });
        } catch (error) {
            console.error("Error searching bookings:", error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: "Internal Server Error"
                }
            });
        }
    },
    
    /**
     * Update booking status
     */
    async updateBookingStatus(req, res) {
        try {
            const ownerId = req.user?.id;
            const bookingId = parseInt(req.params.id);
            const { status } = req.body;
            
            if (isNaN(bookingId) || bookingId <= 0) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: "Invalid booking ID"
                    }
                });
            }
            
            const result = await bookingService.updateBookingStatus(bookingId, status, ownerId);
            
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 400,
                        message: result.message
                    }
                });
            }
            
            return res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error("Error updating booking status:", error);
            return res.status(500).json({
                success: false,
                error: {
                    code: 500,
                    message: "Internal Server Error"
                }
            });
        }
    }
};