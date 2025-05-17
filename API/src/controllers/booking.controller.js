import BookingService from "../services/booking.service.js";
import BookingRequestBuilder from "../builders/BookingRequestBuilder.js";
export default {
	async bookRoom(req, res) {
		try {
			const reqBody = req.body;
			const guest = req.user;

			const builder = new BookingRequestBuilder() //
				.withDateRange(reqBody.startDate, reqBody.endDate)
				.withGuestCount(reqBody.guestCount)
				.withRooms(reqBody.rooms)
				.withGuestId(guest.id);

			const data = builder.build();

			const result = await BookingService.bookRoom(data);
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
