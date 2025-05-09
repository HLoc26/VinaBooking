import { AccommodationRepository } from "../database/repositories/accommodation.repository.js";
import { RoomRepository } from "../database/repositories/room.repository.js";
import { ReviewRepository } from "../database/repositories/review.repository.js";

// Import classes
import AccommodationClass from "../classes/Accommodation.js";

import { Accommodation, Review } from "../classes/index.js";

export default {
	async findById(id, startDate, endDate) {
		const { accommodation, bookedCounts } = await AccommodationRepository.getFullInfo(id, startDate, endDate);
		const reviewsData = await ReviewRepository.findByAccommodationId(id);
		//console.log("Accommodation model:", accommodation);

		if (!accommodation) return null;

		console.log("Accommodation model:", accommodation.dataValues);

		const accommodationInstance = AccommodationClass.fromModel(accommodation);

		//console.log("Accommodation instance:", accommodationInstance);

		return {
			...accommodationInstance.toPlain(bookedCounts),
			reviews: reviewsData.map((review) => Review.fromModel(review).toPlain()),
		};
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

			const minPrice = accommodation.getMinPrice();

			const rating = await accommodation.getAvgRating();
			// Add accommodation to results if it has enough available rooms
			if (availableRooms.length > 0) {
				results.push({ ...accommodation.toPlain(availableRooms), minPrice, rating });
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
				const rating = await accommodation.getAvgRating();

				await accommodation.loadRooms();

				const minPrice = accommodation.getMinPrice();

				return {
					...accommodation.toPlain(),
					rooms: undefined, // Does not need to get rooms
					rating,
					minPrice,
				};
			})
		);

		// Sort by averageStar in descending order
		processedAccommodations.sort((a, b) => (parseFloat(b.averageStar) || 0) - (parseFloat(a.averageStar) || 0));

		return processedAccommodations;
	},
};
