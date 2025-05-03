import { AccommodationRepository } from "../database/repositories/accommodation.repository.js";
import { RoomRepository } from "../database/repositories/room.repository.js";

import { Accommodation, Address } from "../classes/index.js";

export default {
	async findById(id) {
		const accommodation = await AccommodationRepository.getFullInfo(id);

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

		// Validate input
		if (!startDate || !endDate) {
			throw new Error("startDate and endDate are required.");
		}

		// 1. Retrieve accommodations based on location
		const accommodations = await AccommodationRepository.findByAddress({ city, state, postalCode, country });

		// 2. Filter accommodations and their rooms
		const results = [];
		for (const accommodationModel of accommodations) {
			const accommodation = Accommodation.fromModel(accommodationModel);
			await accommodation.loadRooms();

			// Filter available rooms in the accommodation
			const availableRooms = [];
			for (const room of accommodation.rooms) {
				const bookedCount = await RoomRepository.getBookedCount(room.id, startDate, endDate);
				const availableCount = room.count - bookedCount;

				if (
					availableCount >= roomCount && // Check if enough rooms are available
					room.canHost(adultCount) && // Check if the room can host the required number of adults
					room.inPriceRange(priceMin, priceMax) // Check if the room is within the price range
				) {
					availableRooms.push(room);
				}
			}

			// Add accommodation to results if it has enough available rooms
			if (availableRooms.length > 0) {
				results.push(accommodation.toPlainWithRooms(availableRooms));
			}
		}

		return results;
	},

	async findPopular() {
		// Fetch accommodations with their booking counts (already sorted desc by bookingCount)
		const accommodations = await AccommodationRepository.findPopular();

		if (!accommodations || accommodations.length === 0) {
			throw new Error("No accommodations found.");
		}

		// Convert to plain objects if they aren't already
		const plain = accommodations.map((acc) => (acc.get ? acc.get({ plain: true }) : acc));

		// Process each accommodation to simplify amenities
		const processedAccommodations = plain.map((accommodation) => {
			// Create a simplified amenities array of strings
			const amenities = accommodation.AccommodationAmenities?.map((item) => item.Amenity?.name).filter(Boolean) || [];

			// Location string built from accommodation.Address
			const location = `${accommodation.Address.city}, ${accommodation.Address.state}, ${accommodation.Address.country}`;

			// Return the accommodation with simplified amenities
			return {
				...accommodation,
				amenities, // Add the new amenities array
				location, // New location string
				AccommodationAmenities: undefined, // Remove the original complex structure
				Reviews: undefined,
				Address: undefined,
			};
		});

		// Sort by averageStar in descending order
		processedAccommodations.sort((a, b) => (parseFloat(b.averageStar) || 0) - (parseFloat(a.averageStar) || 0));

		return processedAccommodations;
	},
};
