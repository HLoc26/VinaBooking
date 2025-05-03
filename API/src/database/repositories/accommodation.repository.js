import { Accommodation } from "../../classes/index.js";
import { Op } from "sequelize";
import {
	Accommodation as AccommodationModel,
	AccommodationAmenity as AccommodationAmenityModel,
	Address as AddressModel,
	Image as ImageModel,
	Room as RoomModel,
	RoomAmenity as RoomAmenityModel,
	Amenity as AmenityModel,
} from "../models/index.js";

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

	async findByAddress({ city, state, postalCode }) {
		const conditions = {};

		if (city) {
			conditions[`$${AddressModel.name}.city$`] = { [Op.like]: `%${city}%` };
		}
		if (state) {
			conditions[`$${AddressModel.name}.state$`] = { [Op.like]: `%${state}%` };
		}
		if (postalCode) {
			conditions[`$${AddressModel.name}.postal_code$`] = { [Op.like]: `%${postalCode}%` };
		}
		// Do not search by country, the data could be huge

		return await AccommodationModel.findAll({
			where: conditions,
			include: {
				model: AddressModel,
				attributes: [],
			},
		});
	},

	async getFullInfo(accommId) {
		const accommodation = await AccommodationModel.findOne({
			where: { id: accommId },
			include: [
				{
					model: AccommodationAmenityModel,
					include: [{ model: AmenityModel }],
				},
				{
					model: AddressModel,
				},
				{
					model: RoomModel,
					include: [
						{ model: ImageModel },
						{
							model: RoomAmenityModel,
							include: [{ model: AmenityModel }],
						},
					],
				},
				{
					model: ImageModel,
				},
			],
		});
		return accommodation;
	},
};
