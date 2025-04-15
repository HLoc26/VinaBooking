import Accommodation from "../database/models/Accommodation.model.js";
import AccommodationAmenity from "../database/models/AccommodationAmenity.model.js";
import Address from "../database/models/Address.model.js";
import Image from "../database/models/Image.model.js";
import Room from "../database/models/Room.model.js";
import RoomAmenity from "../database/models/RoomAmenity.model.js";
import Amenity from "../database/models/Amenity.model.js";

export default {
	async findById(id) {
		const accommodation = await Accommodation.findOne({
			where: { id },
			include: [
				{
					model: AccommodationAmenity,
					include: [{ model: Amenity }],
				},
				{
					model: Address,
				},
				{
					model: Room,
					include: [
						{ model: Image },
						{
							model: RoomAmenity,
							include: [{ model: Amenity }],
						},
					],
				},
				{
					model: Image,
				},
			],
		});

		if (!accommodation) return null;

		const plain = accommodation.toJSON();

		// Merge Amenity fields into AccommodationAmenity
		plain.AccommodationAmenities = plain.AccommodationAmenities.map((aa) => {
			const { Amenity, ...rest } = aa;
			if (Amenity) {
				const { id: amenityId, ...amenityFields } = Amenity;
				return {
					...rest,
					...amenityFields,
					amenityId,
				};
			}
			return aa;
		});

		// Merge Amenity fields into RoomAmenity
		plain.Rooms = plain.Rooms.map((room) => {
			const updatedRoom = { ...room };
			if (room.RoomAmenities) {
				updatedRoom.RoomAmenities = room.RoomAmenities.map((ra) => {
					const { Amenity, ...rest } = ra;
					if (Amenity) {
						const { id: amenityId, ...amenityFields } = Amenity;
						return {
							...rest,
							...amenityFields,
							amenityId,
						};
					}
					return ra;
				});
			}
			return updatedRoom;
		});

		return plain;
	},
};
