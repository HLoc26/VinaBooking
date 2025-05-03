import { BookingRepository } from "../database/repositories/booking.repository.js";
import { User, BookingItem, Room } from "./index.js";
/**
 * Contains information about a booking.
 * @class Booking
 */
class Booking {
	constructor({ id, bookingItems, guest, startDate, endDate, guestCount, status = EBookingStatus.BOOKED }) {
		this.id = id;
		this.bookingItems = bookingItems;
		this.guest = guest;
		this.startDate = startDate;
		this.endDate = endDate;
		this.guestCount = guestCount;
		this.status = status;
	}

	static async fromModel(model) {
		const guest = new User({ id: model.userId });
		await guest.loadInfo();

		const bookingItemRecords = await BookingRepository.findBookingItems(model.id);

		const bookingItems = await Promise.all(
			bookingItemRecords.map(async (itemRecord) => {
				const roomRecord = new Room({ id: itemRecord.roomId });
				await roomRecord.loadInfo();
				const room = Room.fromModel(roomRecord);
				return new BookingItem({
					id: itemRecord.id,
					room: room,
					count: itemRecord.count,
				});
			})
		);

		return new Booking({
			id: model.id,
			bookingItems: bookingItems,
			guest: guest.toPlain(),
			startDate: model.startDate,
			endDate: model.endDate,
			guestCount: model.guestCount,
			status: model.status,
		});
	}

	getDayCount() {
		let start = new Date(this.startDate);
		let end = new Date(this.endDate);
		let timeDifference = end - start;
		let daysDifference = timeDifference / (1000 * 3600 * 24);
		return daysDifference;
	}

	toPlain() {
		return {
			id: this.id,
			bookingItems: this.bookingItems,
			guest: this.guest,
			startDate: this.startDate,
			endDate: this.endDate,
			guestCount: this.guestCount,
			status: this.status,
		};
	}
}

export default Booking;
