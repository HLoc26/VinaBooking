import { FavouriteList, Accommodation } from "../database/models/index.js";

export default {
	// Add an accommodation to the user's favourite list
	async add(userId, accommodationId) {
		try {
			// Find the user's favourite list
			let favouriteList = await FavouriteList.findOne({
				where: { userId },
			});

			// If the favourite list doesn't exist, create it and warn
			if (!favouriteList) {
				favouriteList = await FavouriteList.create({ userId });
				console.warn(`FavouriteList not found for user ${userId}, created new one.`);
			}

			// Check if the accommodation exists
			// If it doesn't exist, return false
			const accommodation = await Accommodation.findByPk(accommodationId);
			if (!accommodation) {
				console.error(`Accommodation ${accommodationId} not found.`);
				return false;
			}

			// Check if the accommodation is already in the user's favourite list
			// If it is, return false to avoid duplicates
			const alreadyAdded = await favouriteList.hasAccommodation(accommodation);
			if (alreadyAdded) {
				console.warn(`Accommodation ${accommodationId} is already in the user's favourite list.`);
				return false;
			}

			// Add the accommodation to the user's favourite list
			await favouriteList.addAccommodation(accommodation);

			return true;
		} catch (error) {
			console.error("Error in FavouriteService.add:", error);
			return false;
		}
	},

	// Remove an accommodation from the user's favourite list
	async remove(userId, accommodationId) {
		try {
			// Find the user's favourite list
			// If it doesn't exist, return false
			const favouriteList = await FavouriteList.findOne({
				where: { userId },
			});

			// If the favourite list doesn't exist, notify and return false
			if (!favouriteList) {
				console.error(`FavouriteList for user ${userId} not found.`);
				return false;
			}

			// Check if accommodation has been added to favorite list
			const alreadyAdded = await favouriteList.hasAccommodation(accommodationId);
			if (!alreadyAdded) {
				console.warn(`Accommodation ${accommodationId} is not in FavouriteList of user ${userId}.`);
				return false;
			}

			// Remove the accommodation to the user's favourite list
			await favouriteList.removeAccommodation(accommodationId);

			return true;
		} catch (error) {
			console.error("Error in FavouriteService.remove:", error);
			return false;
		}
	},
};
