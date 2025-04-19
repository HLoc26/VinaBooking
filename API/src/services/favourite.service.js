import { FavouriteList } from "../database/models/index.js";

export default {
	// Add an accommodation to the user's favourite list
	// If the accommodation is already in the list, it won't be added again
	async add(userId, accommodationId) {
		try {
			// Check if the accommodation is already in the user's favourite list
			// If it is, return false (indicating it was not added)
			const [favourite, created] = await FavouriteList.findOrCreate({
				where: { user_id: userId, accommodation_id: accommodationId },
			});

			// If the accommodation was already in the list, created will be false
			// If it was newly created, created will be true
			return created;
		} catch (error) {
			console.error("Error in FavouriteService.add:", error);
			return false;
		}
	},

	// Remove an accommodation from the user's favourite list
	// If the accommodation is not in the list, it won't be removed
	async remove(userId, accommodationId) {
		try {
			// Check if the accommodation is in the user's favourite list
			// If it is, delete it from the list
			const affectedRows = await FavouriteList.destroy({
				where: { user_id: userId, accommodation_id: accommodationId },
			});

			// If affectedRows is greater than 0, it means the accommodation was successfully removed
			// If affectedRows is 0, it means the accommodation was not in the list
			return affectedRows > 0;
		} catch (error) {
			console.error("Error in FavouriteService.remove:", error);
			return false;
		}
	},
};
