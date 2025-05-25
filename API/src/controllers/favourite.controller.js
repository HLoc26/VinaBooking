import FavouriteService from "../services/favourite.service.js";
import AddFavouriteCommand from "../classes/commands/AddFavouriteCommand.js";
import RemoveFavouriteCommand from "../classes/commands/RemoveFavouriteCommand.js";

export default {
	async getFavouriteList(req, res) {
		try {
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ success: false, error: { code: 401, message: "Unauthorized" } });

			const favList = await FavouriteService.findByUserId(userId);

			if (!favList) {
				return res.status(404).json({
					success: false,
					error: {
						code: 404,
						message: "FavouriteList not found",
					},
				});
			}
			return res.status(200).json({
				success: true,
				message: "Successfully retrieved user favourite list",
				payload: favList,
			});
		} catch (error) {
			console.error("Error retrieving favourite list:", error);
			return res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: "Internal Server Error",
				},
			});
		}
	},
	async addToFavourite(req, res) {
		try {
			// Extract and validate userId from request object
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ success: false, error: { code: 401, message: "Unauthorized" } });

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

			// Create and execute command
			const command = new AddFavouriteCommand(FavouriteService, userId, accommodationId);
			const result = await command.execute();

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
					message: "Internal Server Error",
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

			// Create and execute command
			const command = new RemoveFavouriteCommand(FavouriteService, userId, accommodationId);
			const result = await command.execute();

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
