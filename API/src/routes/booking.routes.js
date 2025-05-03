import { Router } from "express";
import bookingController from "../controllers/booking.controller.js";
import bookingMiddleware from "../middlewares/booking.mdw.js";
import authMiddleware from "../middlewares/auth.mdw.js";
import ownerMiddleware from "../middlewares/owner.mdw.js";

const bookingRouter = Router();

// Apply auth middleware to all booking routes
bookingRouter.use(authMiddleware.decodeJwt);
// Ensure user is an accommodation owner
bookingRouter.use(ownerMiddleware.isAccommodationOwner);

// Get all bookings for the owner (with optional status filter)
bookingRouter.get(
    "/", 
    bookingMiddleware.validateGetBookings, 
    bookingController.getOwnerBookings
);

// Search for bookings by ID
bookingRouter.get(
    "/search", 
    bookingMiddleware.validateBookingSearch, 
    bookingController.searchBookings
);

// Get booking details by ID
bookingRouter.get(
    "/:id", 
    bookingController.getBookingDetails
);

// Update booking status
bookingRouter.patch(
    "/:id/status", 
    bookingMiddleware.validateUpdateBooking, 
    bookingController.updateBookingStatus
);

export default bookingRouter;