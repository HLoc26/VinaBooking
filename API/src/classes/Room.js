/**
 * @class Room
 */
class Room {
	constructor(id, name, maxCapacity, size, description, price, amenities, images) {
		this.id = id;
		this.name = name;
		this.maxCapacity = maxCapacity;
		this.size = size;
		this.description = description;
		this.price = price;
		this.amenities = amenities;
		this.images = images;
	}

	isAvailable(startDate, endDate) {
		return true;
	}
}

export default Room;
