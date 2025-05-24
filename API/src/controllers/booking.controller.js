import BookingService from "../services/booking.service.js";
import { HotelBookingFacade } from "../facades/index.js";

export default {
	async bookRoom(req, res) {
		try {
			const { rooms, startDate, endDate, guestCount } = req.body;
			const guest = req.user;

			// Use facade for complete booking workflow
			const result = await HotelBookingFacade.completeBooking({
				rooms,
				guestId: guest.id,
				startDate,
				endDate,
				guestCount,
				guestEmail: guest.email,
			});

			return res.status(200).json({
				success: true,
				message: "Successfully booked",
				payload: result,
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
			if (error.message === "User not found") {
				return res.status(404).json({
					success: false,
					error: {
						code: 404,
						message: "User not found.",
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
