import bookingRepo from "../database/repositories/booking.repo.js";

export default {
	async getBookingList(userId) {
		const bookings = await bookingRepo.findAll(userId);
		return bookings.map((booking) => booking.toJSON());
	},
};
