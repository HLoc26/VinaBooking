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
			const favouriteListModel = await FavouriteRepository.findByUser(userId);

			// Check if the accommodation exists
			const accommodationModel = await AccommodationRepository.findById(accommodationId);
			if (!accommodationModel) {
				throw new Error(`Accommodation ${accommodationId} not found.`);
			}

			const accommInstance = Accommodation.fromModel(accommodationModel);

			const listInstance = FavouriteList.fromModel(favouriteListModel);

			// Check if the accommodation is already in the user's favourite list
			const alreadyAdded = listInstance.hasAccommodation(accommInstance);
			if (alreadyAdded) {
				throw new Error(`Accommodation ${accommodationId} is already in the user's favourite list.`);
			}

			// Add the accommodation to the user's favourite list
			listInstance.addAccommodation(accommInstance);

			await FavouriteRepository.save(listInstance);

			return true;
		} catch (error) {
			console.error("Error in FavouriteService.add:", error);
			throw new Error(error.message);
		}
	},

	// Remove an accommodation from the user's favourite list
	async remove(userId, accommodationId) {
		try {
			const favouriteListModel = await FavouriteRepository.findByUser(userId);

			const accommodationModel = await AccommodationRepository.findById(accommodationId);

			const listInstance = FavouriteList.fromModel(favouriteListModel);

			const accommInstance = Accommodation.fromModel(accommodationModel);

			// Check if accommodation has been added to favorite list
			const alreadyAdded = listInstance.hasAccommodation(accommInstance);
			if (!alreadyAdded) {
				throw new Error(`Accommodation ${accommodationId} is not in FavouriteList of user ${userId}.`);
			}

			listInstance.removeAccommodation(accommInstance);

			await FavouriteRepository.save(listInstance);
			return true;
		} catch (error) {
			console.error("Error in FavouriteService.remove:", error);
			return false;
		}
	},
};
