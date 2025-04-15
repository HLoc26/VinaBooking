import Accommodation from "../database/models/Accommodation.model.js";
import AccommodationAmenity from "../database/models/AccommodationAmenity.model.js";
import Address from "../database/models/Address.model.js";
import Image from "../database/models/Image.model.js";
import Room from "../database/models/Room.model.js";

export default {
	async findById(id) {
		const accommodation = await Accommodation.findOne({
			where: { id },
			include: [
				{
					model: Address,
				},
				{
					model: AccommodationAmenity,
				},
				{
					model: Room,
				},
				{
					model: Image,
				},
			],
        });
        
		return accommodation ? accommodation.toJSON() : null;
	},
};
