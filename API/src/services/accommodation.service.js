import { AccommodationRepository } from "../database/repositories/accommodation.repository.js";
import { BookingRepository } from "../database/repositories/booking.repository.js";

import { Accommodation } from "../classes/index.js";

export default {
	async findById(id) {
		const accommodation = AccommodationRepository.getFullInfo(id);

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

	async search(criteria) {
		// prettier-ignore
		const {
			city, state, postalCode, country,
			startDate, endDate,
			roomCount, adultCount,
			priceMin = 0, priceMax = Infinity
		} = criteria;

		// 1. Find all rooms that are not available from startDate to endDate (status != CANCELED)
		const bookedRooms = await BookingRepository.findBetweenDate(startDate, endDate);
		const bookedRoomIds = new Set(bookedRooms.map((room) => +room.roomId));

		// 2. Find all accommodation in the location and their rooms
		const accModels = await AccommodationRepository.findByAddress({ city, state, postalCode, country });

		// 3. Filter all the accommodation's rooms to select all the available rooms
		const results = [];
		for (const accModel of accModels) {
			const acc = Accommodation.fromModel(accModel);
			await acc.loadRooms();

			const availableRooms = acc.getAvailableRooms({ bookedRoomIds, adultCount, priceMin, priceMax });

			if (availableRooms.length >= roomCount) {
				results.push(acc.toPlainWithRooms(availableRooms));
			}
		}

		return results;
	},
};
