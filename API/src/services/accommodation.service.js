import { AccommodationRepository } from "../database/repositories/accommodation.repository.js";
import { RoomRepository } from "../database/repositories/room.repository.js";
import { BookingRepository } from "../database/repositories/booking.repository.js";

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

	async search({ city, state, postalCode, country, startDate, endDate, roomCount, adultCount, priceMin, priceMax }) {
		priceMin = Math.max(priceMin ?? 0, 0);
		priceMax = priceMax ?? Infinity;
		// 1. Find all rooms that are not available from startDate to endDate (status != CANCELED)
		const bookedRooms = await BookingRepository.findBetweenDate(startDate, endDate);
		const bookedRoomsIds = bookedRooms.map((room) => +room.roomId);

		// 2. Find all accommodation in the location and their rooms
		const matchedAccomm = await AccommodationRepository.findByAddress({ city, state, postalCode, country });

		// 3. Filter all the accommodation's rooms to select all the available rooms
		const matchedAccommWithRooms = (
			await Promise.all(
				matchedAccomm.map(async (accomm) => {
					const plainAccomm = accomm.get({ plain: true });
					const accommId = accomm.id;
					const rooms = (await RoomRepository.findByAccommodationId(accommId))
						// Get room that are available and have enough capacity
						.filter((room) => !bookedRoomsIds.includes(room.id) && room.maxCapacity >= adultCount)
						// Filter rooms by price
						.filter((room) => room.price >= priceMin && room.price <= priceMax && room.isActive)
						.map((room) => room.get({ plain: true })); // Convert to plain object

					console.log(accomm.id, rooms.length);

					return rooms.length >= roomCount ? { ...plainAccomm, rooms: rooms } : null;
				})
			)
		).filter(Boolean); // Make sure there are no null field

		return matchedAccommWithRooms;
	},
};
