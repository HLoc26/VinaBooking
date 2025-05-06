import { RoomRepository } from "../database/repositories/room.repository.js";
import { ReviewRepository } from "../database/repositories/review.repository.js";
import Address from "./Address.js";
import Room from "./Room.js";
import Review from "./Review.js";
import AccommodationAmenity from "./AccommodationAmenity.js";

/**
 * Accommodation class
 * @class Accommodation
 */
class Accommodation {
	constructor({ id, name, address, amenities = [], rooms = [], isActive = true }) {
		this.id = id;
		this.name = name;
		this.address = address;
		this.amenities = amenities; // Amenity object
		this.rooms = rooms; // Array of Room objects
		this.isActive = isActive;
	}

	static fromModel(model) {
		return new Accommodation({
			id: model.accommodationId || model.id,
			name: model.name,
			address: Address.fromModel(model.Address),
			amenities: model.AccommodationAmenities?.map((amenity) => AccommodationAmenity.fromModel(amenity)) || [],
			rooms: model.rooms?.map((room) => Room.fromModel(room)) || [],
			isActive: model.isActive,
		});
	}

	getMinPrice() {
		let minPrice = Infinity;
		this.rooms.forEach((room) => {
			if (room.price < minPrice) {
				minPrice = room.price;
			}
		});
		return minPrice === Infinity ? 0 : minPrice;
	}

	async loadRooms() {
		const roomModels = await RoomRepository.findByAccommodationId(this.id);
		this.rooms = roomModels.map((roomModel) => Room.fromModel(roomModel));
	}

	getAvailableRooms({ bookedRoomIds, adultCount, priceMin, priceMax }) {
		// prettier-ignore
		const a = this.rooms.filter(
			(room) => (
				room.inBookedRooms(bookedRoomIds) &&
				room.canHost(adultCount) &&
				room.inPriceRange(priceMin, priceMax)
			)
		);
		return a;
	}

	getRoomCount() {
		return this.rooms.length;
	}

	getLocationString() {
		return this.address.getLocationString();
	}

	getSimplifiedAmenities() {
		return this.amenities?.map((amenity) => amenity.name).filter(Boolean) || [];
	}

	async getAvgRating() {
		const reviewModels = await ReviewRepository.findByAccommodationId(this.id);

		const stars = reviewModels.map((review) => Review.fromModel(review).getStar());

		const avgStar = (stars.reduce((acc, val) => acc + val, 0) / stars.length).toFixed(1);

		return avgStar;
	}

	toPlain() {
		return {
			id: this.id,
			name: this.name,
			address: this.getLocationString(),
			amenities: this.getSimplifiedAmenities(),
			rooms: this.rooms.map((room) => room.toPlain()),
			isActive: this.isActive,
		};
	}

	toPlainWithRooms(rooms) {
		return {
			id: this.id,
			name: this.name,
			address: this.address,
			rooms: rooms.map((room) => room.toPlain()),
			isActive: this.isActive,
		};
	}
}

export default Accommodation;
