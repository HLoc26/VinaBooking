import bookingRepo from "../database/repositories/booking.repo.js";

export default {
	async getBookingList(userId) {
		const bookings = await bookingRepo.findAll(userId); // Fetch bookings from the repository
		return bookings.map((booking) => booking.toJSON()); // Convert each booking instance to a plain object for serialization
	},
};
