import BookingService from "../services/booking.service.js";
export default {
	async bookRoom(req, res) {
		try {
			const { rooms, startDate, endDate, guestCount } = req.body;
			const guest = req.user;

			const result = await BookingService.bookRoom({ rooms, guestId: guest.id, startDate, endDate, guestCount });
			return res.status(200).json({
				success: true,
				message: "Successfully booked",
				payload: {
					booking: result,
				},
			});
		} catch (error) {
			console.error(error);
			if (error.message === "RoomNotFound") {
				return res.status(404).json({
					success: false,
					error: {
						code: 404,
						message: `Room not found.`,
					},
				});
			}
			if (error.message == "NotEnoughRoom") {
				return res.status(400).json({
					success: false,
					error: {
						code: 400,
						message: "Room is not available.",
					},
				});
			}
			return res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: "Internal server error.",
				},
			});
		}
	},

	async viewBookings(req, res) {
		try {
			const userId = req.user?.id;
			if (!userId) {
				return res.status(401).json({ success: false, error: { code: 401, message: "Unauthorized" } });
			}
			const bookings = await BookingService.getBookingList(userId);
			if (!bookings || bookings.length === 0) {
				return res.status(200).json({ success: true, message: "No bookings found", payload: [] });
			}
			return res.status(200).json({ success: true, message: "Successfully retrieved booking history", payload: bookings });
		} catch (error) {
			console.error("Error retrieving booking history:", error);
			return res.status(500).json({ success: false, error: { code: 500, message: "Internal Server Error" } });
		}
	},
};
