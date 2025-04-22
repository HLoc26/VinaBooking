import { Op } from "sequelize";
import { Accommodation, Address } from "../models/index.js";

export default {
	async findByAddress({ city, state, postalCode }) {
		const conditions = {};

		if (city) {
			conditions[`$${Address.name}.city$`] = { [Op.like]: `%${city}%` };
		}
		if (state) {
			conditions[`$${Address.name}.state$`] = { [Op.like]: `%${state}%` };
		}
		if (postalCode) {
			conditions[`$${Address.name}.postal_code$`] = { [Op.like]: `%${postalCode}%` };
		}
		// Do not search by country, the data could be huge

		return await Accommodation.findAll({
			where: conditions,
			include: {
				model: Address,
				attributes: [],
			},
		});
	},
};
