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
};
