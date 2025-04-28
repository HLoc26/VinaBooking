import { Booking, Room, User } from "../classes/index.js";
import { BookingRepository } from "../database/repositories/booking.repository.js";

export default {
	async bookRoom({ roomId, guestId, startDate, endDate, guestCount }) {
		const room = new Room({ id: roomId });
		await room.loadInfo();

		if (!room) {
			throw new Error("RoomNotFound");
		}

		if (!(await room.isAvailable(startDate, endDate, guestCount))) {
			throw new Error("RoomNotAvailable");
		}

		const user = new User({ id: guestId });
		await user.loadInfo();

		const booking = new Booking({
			room: room,
			guest: user,
			startDate: startDate,
			endDate: endDate,
			guestCount: guestCount,
		});

		const bookingRecord = await BookingRepository.createNew(booking.toPlain());

		return bookingRecord;
	},
};
