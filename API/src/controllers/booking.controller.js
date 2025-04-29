import bookingService from "../services/booking.service.js";

export default {
	async getBookingList(req, res) {
		try {
			const userId = req.user.id;
			const bookings = await bookingService.getBookingList(userId);

			return res.status(200).json({
				success: true,
				message: "Bookings retrieved successfully",
				payload: bookings,
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
