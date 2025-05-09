import { RoomRepository } from "../database/repositories/room.repository.js";
import { ReviewRepository } from "../database/repositories/review.repository.js";
import Address from "./Address.js";
import Room from "./Room.js";
import Review from "./Review.js";
import Policy from "./Policy.js";
import Image from "./Image.js";
import AccommodationAmenity from "./AccommodationAmenity.js";

/**
 * Accommodation class
 * @class Accommodation
 */
class Accommodation {
	constructor({ id, name, amenities, address, rooms, images, policy }) {
		this.id = id;
		this.name = name;
		this.amenities = amenities ? amenities.map((a) => new AccommodationAmenity(a)) : [];
		this.address = address ? new Address(address) : null;
		this.rooms = rooms ? rooms.map((r) => new Room(r)) : [];
		this.images = images ? images.map((i) => new Image(i)) : [];
		this.policy = policy ? new Policy(policy) : null;
	}

	static fromModel(model) {
		return new Accommodation({
			id: model.accommodationId || model.id,
			name: model.name,
			address: model.Address,
			amenities: model.AccommodationAmenities || [],
			rooms: model.Rooms || [],
			images: model.Images || [],
			policy: model.Policy,
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

	// async isCurrentlyActive() {
	// 	const accommodation = await AccommodationRepository.findById(this.id);
	// 	return accommodation?.isActive ?? false;
	// }

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
		console.log("@@@@@@Accommodation amenities:", this.amenities);
		return this.amenities?.map((amenity) => amenity.toPlain()) || [];

		//return this.amenities?.map((amenity) => amenity.id).filter(Boolean) || [];
	}

	async getAvgRating() {
		const reviewModels = await ReviewRepository.findByAccommodationId(this.id);

		const stars = reviewModels.map((review) => Review.fromModel(review).getStar());

		const avgStar = (stars.reduce((acc, val) => acc + val, 0) / stars.length).toFixed(1);

		return avgStar;
	}

	toPlain(bookedCounts = {}) {
		return {
			id: this.id,
			name: this.name,
			address: this.getLocationString(),
			amenities: this.getSimplifiedAmenities(),
			//amenities: this.amenities.map((amenity) => amenity.toPlain()),
			rooms: this.rooms.map((room) => room.toPlain(bookedCounts[room.id] || 0)),
			images: this.images.map((image) => image.toPlain()),
			policy: this.policy ? this.policy.toPlain() : null,
			//isActive: await this.isCurrentlyActive(),
		};
	}

	async toPlainWithRooms(rooms) {
		return {
			id: this.id,
			name: this.name,
			address: this.address,
			rooms: rooms.map((room) => room.toPlain()),
			//isActive: await this.isCurrentlyActive(),
		};
	}
}

export default Accommodation;
