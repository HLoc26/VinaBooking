import FavouriteService from "../services/favourite.service.js";

export default {
	async getFavouriteList(req, res) {
		try {
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ success: false, error: { message: "Unauthorized" } });

			const favList = await FavouriteService.findByUserId(userId);

			if (!favList) {
				return res.json({
					success: false,
					error: {
						code: 500,
						message: "FavouriteList is null",
					},
				});
			}
			return res.json({
				success: true,
				message: "Successfully retrieved user favourite list",
				payload: favList,
			});
		} catch (error) {
			console.error(error.message);
			return res.json({
				success: false,
				error: {
					code: 500,
					message: "Unknown error",
				},
			});
		}
	},

	async addToFavourite(req, res) {
		try {
			// Extract and validate userId from request object
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ success: false, error: { message: "Unauthorized" } });

			// Extract and validate accommodationId from request body
			const accommodationId = Number(req.body.accommodationId);
			if (!accommodationId || isNaN(accommodationId) || accommodationId <= 0) {
				return res.status(400).json({
					success: false,
					error: {
						code: 400,
						message: "Invalid accommodation ID.",
					},
				});
			}

			// Call the service to add the accommodation to the user's favourites
			const result = await FavouriteService.add(userId, accommodationId);

			if (result) {
				return res.status(200).json({
					success: true,
					message: "Successfully added to favourites",
				});
			} else {
				return res.status(400).json({
					success: false,
					error: {
						code: 400,
						message: `Failed to add to favourites`,
					},
				});
			}
		} catch (error) {
			console.error("Error adding to favourites:", error);
			return res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: error.message,
				},
			});
		}
	},

	async removeFromFavourite(req, res) {
		try {
			// Extract userId from request object
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ success: false, error: { message: "Unauthorized" } });

			// Extract accommodationId from request parameters
			const accommodationId = +req.params?.accommodationId;
			if (!accommodationId || isNaN(accommodationId) || accommodationId <= 0) {
				return res.status(400).json({
					success: false,
					error: {
						code: 400,
						message: "Invalid accommodation ID.",
					},
				});
			}

			// Call the service to remove the accommodation from the user's favourites
			// The service will check if the accommodation is in the list and remove it if it is
			const result = await FavouriteService.remove(userId, accommodationId);

			if (result) {
				return res.status(200).json({
					success: true,
					message: "Successfully removed from favourites",
				});
			} else {
				return res.status(400).json({
					success: false,
					error: {
						code: 400,
						message: "Failed to remove from favourites",
					},
				});
			}
		} catch (error) {
			console.error("Error removing from favourites:", error);
			return res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: "Internal Server Error",
				},
			});
		}
	},
};
