/**
 * Accommodation class
 * @class Accommodation
 */
class Accommodation {
	constructor(id, name, amenities, address, rooms, images) {
		this.id = id;
		this.name = name;
		this.amenities = amenities;
		this.address = address;
		this.rooms = rooms;
		this.images = images;
	}

	getRoomCount() {
		return this.rooms.length;
	}

	getAvailableRooms(startDate, endDate) {
		return this.rooms.filter((room) => room.isAvailable(startDate, endDate));
	}

	getBookings() {
		return this.rooms.flatMap((room) => room.getBookings());
	}
}

export default Accommodation;
