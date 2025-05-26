import { AccommodationRepository } from "../database/repositories/accommodation.repository.js";
import { RoomRepository } from "../database/repositories/room.repository.js";
import { ReviewRepository } from "../database/repositories/review.repository.js";

// Import classes
import AccommodationClass from "../classes/Accommodation.js";

import { Accommodation, Review } from "../classes/index.js";
import AccommodationResponseBuilder from "../builders/conreteBuilders/AccommodationResponseBuilder.js";
import AccommodationDirector from "../builders/directors/AccommodationDirector.js";

export default {
	async findById(id, startDate, endDate) {
		const accommodationModel = await AccommodationRepository.getFullInfo(id, startDate, endDate);
		if (!accommodationModel) return null;

		const accommodationInstance = AccommodationClass.fromModel(accommodationModel);

		const reviews = await ReviewRepository.findByAccommodationId(id);

		const bookedCount = accommodationInstance.computeBookedCounts(accommodationModel.Rooms, startDate, endDate); // tách logic tính bookedCounts vào trong class

		const builder = new AccommodationResponseBuilder(accommodationInstance);
		const director = new AccommodationDirector(builder);

		return director.buildForDetail();
	},

	async search(criteria) {
		const { city, state, postalCode, country } = criteria.location;
		const { priceMin, priceMax } = criteria.price;
		const { startDate, endDate } = criteria.getISODate();
		const { adultCount, roomCount } = criteria.occupancy;

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

			// Filter available rooms in the accommodation
			const availableRooms = await accommodation.getAvailableRooms({ adultCount, priceMin, priceMax, startDate, endDate, roomCount });
			// Add accommodation to results if it has enough available rooms
			if (availableRooms.length > 0) {
				const builder = new AccommodationResponseBuilder(accommodation);

				const director = new AccommodationDirector(builder);
				results.push(director.buildForSearch());
			}
		}

		return results;
	},

	async findPopular() {
		// Fetch accommodations with their booking counts (already sorted desc by bookingCount)
		const accommodationModels = await AccommodationRepository.findPopular();

		if (!accommodationModels || accommodationModels.length === 0) {
			throw new Error("No accommodations found.");
		}

		const accommodationInstances = accommodationModels.map((model) => Accommodation.fromModel(model.dataValues));

		// Process each accommodation using class methods
		const processedAccommodations = await Promise.all(
			accommodationInstances.map(async (accommodation) => {
				const builder = new AccommodationResponseBuilder(accommodation);
				const director = new AccommodationDirector(builder);
				return director.buildForPopular();
			})
		);

		// Sort by averageStar in descending order
		processedAccommodations.sort((a, b) => (parseFloat(b.averageStar) || 0) - (parseFloat(a.averageStar) || 0));

		return processedAccommodations;
	},
};
