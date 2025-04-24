import { accommodationRepo, roomRepo, bookingRepo } from "../database/repository/index.js";

export default {
	async findById(id) {
		const accommodation = accommodationRepo.getFullInfo(id);

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
		// 1. Find all rooms that are not available from startDate to endDate (status != CANCELED)
		const bookedRooms = await bookingRepo.findBetweenDate(startDate, endDate);
		const bookedRoomsIds = bookedRooms.map((room) => +room.roomId);

		// 2. Find all accommodation in the location and their rooms
		const matchedAccomm = await accommodationRepo.findByAddress({ city, state, postalCode, country });

		// 3. Filter all the accommodation's rooms to select all the available rooms
		const matchedAccommWithRooms = (
			await Promise.all(
				matchedAccomm.map(async (accomm) => {
					const plainAccomm = accomm.get({ plain: true });
					const accommId = accomm.id;
					const rooms = (await roomRepo.findByAccommodationId(accommId))
						// Get room that are available and have enough capacity
						.filter((room) => !bookedRoomsIds.includes(room.id) && room.maxCapacity >= adultCount)
						// Filter rooms by price
						.filter((room) => room.price >= priceMin && room.price <= priceMax)
						.map((room) => room.get({ plain: true })); // Convert to plain object

					console.log(accomm.id, rooms.length);

					return rooms.length >= roomCount ? { ...plainAccomm, rooms: rooms } : null;
				})
			)
		).filter(Boolean); // Make sure there are no null field

		return matchedAccommWithRooms;
	},
};
