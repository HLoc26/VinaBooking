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
}

export default BookingItem;
