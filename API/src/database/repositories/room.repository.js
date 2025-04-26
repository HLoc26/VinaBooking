import { Room } from "../models/index.js";

export const RoomRepository = {
	async findByAccommodationId(accommId) {
		return await Room.findAll({ where: { accommodation_id: accommId } });
	},
};
