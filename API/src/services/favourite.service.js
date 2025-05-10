import Accommodation from "../classes/Accommodation.js";
import FavouriteList from "../classes/FavouriteList.js";
import { AccommodationRepository } from "../database/repositories/accommodation.repository.js";
import { FavouriteRepository } from "../database/repositories/favourite.repository.js";

export default {
	// Find favourite list by user id
	async findByUserId(userId) {
		try {
			const favouriteListModel = await FavouriteRepository.findByUser(userId);

			const favouriteListInstance = FavouriteList.fromModel(favouriteListModel);

			const plain = { ...favouriteListInstance.toPlain(), accommodations: [] };

			favouriteListInstance.accommodations.forEach((acc) => {
				const minPrice = acc.getMinPrice();
				const rating = acc.getAvgRating();
				plain.accommodations.push({ ...acc.toPlain(), minPrice, rating });
			});

			return plain;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	},

	// Add an accommodation to the user's favourite list
	async add(userId, accommodationId) {
		try {
			// Find the user's favourite list
			const favouriteList = await FavouriteRepository.findByUser(userId);

			// Check if the accommodation exists
			const accommodation = await AccommodationRepository.findById(accommodationId);
			if (!accommodation) {
				throw new Error(`Accommodation ${accommodationId} not found.`);
			}

			// Check if the accommodation is already in the user's favourite list
			const alreadyAdded = favouriteList.hasAccommodation(accommodation);
			if (alreadyAdded) {
				throw new Error(`Accommodation ${accommodationId} is already in the user's favourite list.`);
			}

			// Add the accommodation to the user's favourite list
			favouriteList.addAccommodation(accommodation);

			await FavouriteRepository.save(favouriteList);

			return true;
		} catch (error) {
			console.error("Error in FavouriteService.add:", error);
			throw new Error(error.message);
		}
	},

	// Remove an accommodation from the user's favourite list
	async remove(userId, accommodationId) {
		try {
			const favouriteList = await FavouriteRepository.findByUser(userId);

			const accommodation = new Accommodation({ id: accommodationId });

			// Check if accommodation has been added to favorite list
			const alreadyAdded = favouriteList.hasAccommodation(accommodation);
			if (!alreadyAdded) {
				throw new Error(`Accommodation ${accommodation.id} is not in FavouriteList of user ${userId}.`);
			}

			// Remove the accommodation from the user's favourite list
			// Fix: Pass the accommodation object instead of just the ID
			favouriteList.removeAccommodation(accommodation);

			await FavouriteRepository.save(favouriteList);
			return true;
		} catch (error) {
			console.error("Error in FavouriteService.remove:", error);
			return false;
		}
	},
};
