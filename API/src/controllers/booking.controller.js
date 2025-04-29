import bookingService from "../services/booking.service.js";

export default {
	// Handle the request to get the list of bookings for the authenticated user
	async getBookingList(req, res) {
		try {
			const userId = req.user.id;
			const bookings = await bookingService.getBookingList(userId); // Fetch bookings using the service

			return res.status(200).json({
				success: true,
				message: "Bookings retrieved successfully",
				payload: bookings, // Include the bookings in the response payload
			});
		} catch (error) {
			console.error("Error fetching bookings:", error);
			res.status(500).json({
				success: false,
				error: { code: 500, message: "Internal Server Error" },
			});
		}
	},
};
