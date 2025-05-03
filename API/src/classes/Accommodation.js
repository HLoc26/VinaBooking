import { RoomRepository } from "../database/repositories/room.repository.js";
import Room from "./Room.js";

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

	static fromModel(model) {
		return new Accommodation({
			id: model.id,
			name: model.name,
			address: model.address,
			rooms: model.rooms,
			isActive: model.isActive,
		});
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
