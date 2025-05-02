import { BookingRepository } from "../database/repositories/booking.repository.js";
/**
 * Contains information about a room in a booking
 * @class BookingItem
 */
class BookingItem {
	constructor({ id, room, count }) {
		this.id = id;
		this.room = room;
		this.count = count;
	}

	// Save the BookingItem instance to the database
	async save(bookingId) {
		if (!bookingId) {
			throw new Error("Booking ID is required to save a BookingItem");
		}

		// Use the repository to save the BookingItem
		const savedItem = await BookingRepository.createBookingItem({
			bookingId,
			roomId: this.room.id,
			count: this.count,
		});

		// Update the instance with the saved ID
		this.id = savedItem.id;
		return this;
	}
}

export default BookingItem;
