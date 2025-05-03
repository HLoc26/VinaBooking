import { EBookingStatus } from "../classes/Booking.js";

export default {
	validateGetBookings(req, res, next) {
		const { status } = req.query;
		
		// If status is provided, validate it against allowed values
		if (status && !Object.values(EBookingStatus).includes(status)) {
			return res.status(400).json({
				success: false,
				error: {
					code: 400,
					message: `Invalid status. Allowed values: ${Object.values(EBookingStatus).join(', ')}`
				}
			});
		}
		
		next();
	},
	
	validateUpdateBooking(req, res, next) {
		const { status } = req.body;
		
		// Status is required for updates
		if (!status) {
			return res.status(400).json({
				success: false,
				error: {
					code: 400,
					message: "Status is required"
				}
			});
		}
		
		// Validate status against allowed values
		if (!Object.values(EBookingStatus).includes(status)) {
			return res.status(400).json({
				success: false,
				error: {
					code: 400,
					message: `Invalid status. Allowed values: ${Object.values(EBookingStatus).join(', ')}`
				}
			});
		}
		
		next();
	},
	
	validateBookingSearch(req, res, next) {
		const { bookingId } = req.query;
		
		if (bookingId && (isNaN(parseInt(bookingId)) || parseInt(bookingId) <= 0)) {
			return res.status(400).json({
				success: false,
				error: {
					code: 400,
					message: "Booking ID must be a positive number"
				}
			});
		}
		
		next();
	}
};