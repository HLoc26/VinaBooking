/**
 * Contains information about a booking.
 * @class Booking
 */
class Booking {
	constructor({ id, room, guest, startDate, endDate, guestCount, status = EBookingStatus.BOOKED }) {
		this.id = id;
		this.room = room;
		this.guest = guest;
		this.startDate = startDate;
		this.endDate = endDate;
		this.guestCount = guestCount;
		this.status = status;
	}

	calculatePrice() {
		return this.room.price * this.getDayCount();
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
			room: this.room,
			guest: this.guest,
			startDate: this.startDate,
			endDate: this.endDate,
			guestCount: this.guestCount,
			status: this.status,
		};
	}
}

/**
 * Enum for accommodation amenity types.
 * @readonly
 * @enum {string}
 */
export const EBookingStatus = Object.freeze({
	BOOKED: "BOOKED",
	RESERVED: "RESERVED",
	CHECKED_IN: "CHECKED_IN",
	COMPLETED: "COMPLETED",
	CANCELED: "CANCELED",
});

export default Booking;
