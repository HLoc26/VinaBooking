/**
 * Contains information about a booking.
 * @class Booking
 */
class Booking {
	constructor(id, room, guest, startDate, endDate, guestCount, status) {
		this.id = id;
		this.room = room;
		this.guest = guest;
		this.startDate = startDate;
		this.endDate = endDate;
		this.guestCount = guestCount;
		this.status = status;
	}

	calculatePrice() {}
}

export const EBookingStatus = Object.freeze({
	BOOKED: "BOOKED",
	RESERVED: "RESERVED",
	CHECKED_IN: "CHECKED_IN",
	COMPLETED: "COMPLETED",
	CANCELED: "CANCELED",
});

export default Booking;
