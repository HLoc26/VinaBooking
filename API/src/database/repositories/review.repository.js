import { Review as ReviewModel } from "../models/index.js";

export const ReviewRepository = {
	async findByAccommodationId(accommId) {
		return await ReviewModel.findAll({ where: { accommodationId: accommId } });
	},
};
