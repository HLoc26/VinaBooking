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

	async isEmptyBetween(startDate, endDate) {
		return await RoomRepository.isEmptyBetween(this.id, startDate, endDate);
	}

	// async isCurrentlyActive() {
	// 	const room = await RoomRepository.findById(this.id);
	// 	return room?.isActive ?? false;
	// }

	getBookedCount(bookingItems, startDate, endDate) {
		return bookingItems.reduce((total, item) => {
			const booking = item.Booking;
			if (booking) {
				const bookingStart = new Date(booking.startDate);
				const bookingEnd = new Date(booking.endDate);
				const checkIn = new Date(startDate);
				const checkOut = new Date(endDate);
				if (bookingStart <= checkOut && bookingEnd >= checkIn) {
					return total + (item.count || 0);
				}
			}
			return total;
		}, 0);
	}

	async isAvailable(adultCount, priceMin, priceMax, startDate, endDate, roomCount) {
		const bookedCount = await RoomRepository.getBookedCount(this.id, startDate, endDate);
		const availableCount = this.count - bookedCount;

		if (
			availableCount >= roomCount && // Check if enough rooms are available
			this.canHost(adultCount) && // Check if the room can host the required number of adults
			this.inPriceRange(priceMin, priceMax) // Check if the room is within the price range
		) {
			return true;
		}
		return false;
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
