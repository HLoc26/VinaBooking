import { Accommodation } from "../../classes/index.js";
import { Accommodation as AccommodationModel } from "../models/index.js";

export const AccommodationRepository = {
	async findById(accommodationId) {
		const model = await AccommodationModel.findByPk(accommodationId);
		if (!model) {
			return null;
		}
		return new Accommodation({
			id: model.id,
			name: model.name,
			isActive: model.isActive,
		});
	},
};
