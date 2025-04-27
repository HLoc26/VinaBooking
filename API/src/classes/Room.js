/**
 * @class Room
 */
class Room {
	constructor({ id, name, maxCapacity, size, description, price, amenities, images, isActive }) {
		this.id = id;
		this.name = name;
		this.maxCapacity = maxCapacity;
		this.size = size;
		this.description = description;
		this.price = price;
		this.amenities = amenities;
		this.images = images;
		this.isActive = isActive;
	}

	static fromModel(model) {
		return new Room({
			id: model.id,
			name: model.name,
			maxCapacity: +model.maxCapacity,
			size: +model.size,
			description: model.description,
			price: +model.price,
			amenities: model.amenities,
			isActive: model.isActive,
		});
	}

	isAvailable(bookedRoomIds) {
		return !bookedRoomIds.has(this.id) && this.isActive;
	}

	canHost(adultCount) {
		return this.maxCapacity >= adultCount;
	}

	inPriceRange(priceMin, priceMax) {
		return this.price >= priceMin && this.price <= priceMax;
	}

	toPlain() {
		return {
			id: this.id,
			name: this.name,
			maxCapacity: this.maxCapacity,
			size: this.size,
			description: this.description,
			price: this.price,
			amenities: this.amenities,
			isActive: this.isActive,
		};
	}
}

export default Room;
