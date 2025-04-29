import { Room } from "../models/index.js";

export default {
	async findByAccommodationId(accommId) {
		return await Room.findAll({ where: { accommodation_id: accommId } });
	},
};