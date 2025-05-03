/**
 * Accommodation class
 * @class Accommodation
 */
class Accommodation {
	constructor({ id, name, address, rooms = [], isActive = true }) {
		this.id = id;
		this.name = name;
		this.address = address;
		this.rooms = rooms; // Array of Room objects
		this.isActive = isActive;
	}

	getRoomCount() {
		return this.rooms.length;
	}

	getAvailableRooms(startDate, endDate) {
		// Logic will be implemented later
	}

	getBookings() {
		// Logic will be implemented later
	}
}

export default Accommodation;
