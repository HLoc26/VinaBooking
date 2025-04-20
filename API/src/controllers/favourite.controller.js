import FavouriteService from "../services/favourite.service.js";

export default {
	// Add an accommodation to the user's favourite list
	// If the accommodation is already in the list, it won't be added again
	async addToFavourite(req, res) {
		try {
			// Extract accommodationId from request body
			// The accommodationId is expected to be sent in the request body
			const accommodationId = Number(req.body.accommodationId);

			// Extract userId from request object (or use a default for testing)
			// In a real application, you would get the userId from the authenticated user session
			const userId = req.user?.id || 1; // Default to 1 for testing

			// Validate accommodationId
			// Check if accommodationId is provided and is a number
			// Also check if it's a positive integer
			// This is important to prevent SQL injection and ensure data integrity =))
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

			// Check the result and send appropriate response
			// If result is true, it means the accommodation was successfully added to favourites
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
						message: "Failed to add to favourites",
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

	// Remove an accommodation from the user's favourite list
	// If the accommodation is not in the list, it won't be removed
	async removeFromFavourite(req, res) {
		try {
			// Extract accommodationId from request body
			// The accommodationId is expected to be sent in the request body
			const accommodationId = Number(req.body.accommodationId);

			// Extract userId from request object
			// In a real application, you would get the userId from the authenticated user session
			const userId = req.user?.id || 1;

			// Validate accommodationId
			// Check if accommodationId is provided and is a number
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

			// Check the result and send appropriate response
			// If result is true, it means the accommodation was successfully removed from favourites
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
