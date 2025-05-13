import { RoomRepository } from "../database/repositories/room.repository.js";
import RoomAmenity from "./RoomAmenity.js";
import Image from "./Image.js";

/**
 * @class Room
 */
class Room {
	constructor({ id, name, maxCapacity, size, description, price, amenities, images, count }) {
		this.id = id;
		this.name = name;
		this.maxCapacity = maxCapacity;
		this.size = size;
		this.description = description;
		this.price = price;
		this.count = count;
		this.amenities = amenities ? amenities.map((a) => RoomAmenity.fromModel(a)) : [];
		this.images = images ? images.map((i) => Image.fromModel(i)) : [];
	}

	static fromModel(model) {
		return new Room({
			id: model.id,
			name: model.name,
			maxCapacity: +model.maxCapacity,
			size: +model.size,
			description: model.description,
			price: +model.price,
			count: model.count,
			amenities: model.RoomAmenities || [],
			images: model.Images || [],
		});
	}

	async loadInfo() {
		const roomInfo = await RoomRepository.findById(this.id);
		const instance = Room.fromModel(roomInfo);
		Object.assign(this, instance);
	}

	async isAvailableForCount(startDate, endDate, requiredCount) {
		const bookedCount = await RoomRepository.getBookedCount(this.id, startDate, endDate);
		const remain = this.count - bookedCount;
		return remain >= requiredCount;
	}

	getAvailableQuantity(bookedCount = 0) {
		return Math.max(0, this.count - bookedCount);
	}

	async isAvailable(startDate, endDate, adultCount) {
		return this.canHost(adultCount) && (await this.isEmptyBetween(startDate, endDate)) && (await this.isCurrentlyActive());
	}

	async isEmptyBetween(startDate, endDate) {
		return await RoomRepository.isEmptyBetween(this.id, startDate, endDate);
	}

	// async isCurrentlyActive() {
	// 	const room = await RoomRepository.findById(this.id);
	// 	return room?.isActive ?? false;
	// }

	async inBookedRooms(bookedRoomIds) {
		return !bookedRoomIds.has(this.id) && (await this.isCurrentlyActive());
	}

	canHost(adultCount) {
		return this.maxCapacity >= adultCount;
	}

	inPriceRange(priceMin, priceMax) {
		return this.price >= priceMin && this.price <= priceMax;
	}

	toPlain(bookedCount = 0) {
		return {
			id: this.id,
			name: this.name,
			maxCapacity: this.maxCapacity,
			size: this.size,
			description: this.description,
			price: this.price,
			count: this.count,
			amenities: this.amenities?.map((amenity) => amenity.toPlain()) || [],
			images: this.images.map((i) => i.toPlain()),
			availableRooms: this.getAvailableQuantity(bookedCount),
			//isActive: await this.isCurrentlyActive(),
		};
	}
}

export default Room;
