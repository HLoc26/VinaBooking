import FavouriteService from "../services/favourite.service.js";
import AddFavouriteCommand from "../classes/commands/AddFavouriteCommand.js";
import RemoveFavouriteCommand from "../classes/commands/RemoveFavouriteCommand.js";
import RedisClient from "../clients/RedisClient.js";

// Redis client instance
const redis = RedisClient.getClient();

// Configuration constants
const HISTORY_LIMIT = 10; // Maximum number of commands to keep in history
const CACHE_EXPIRY = 3600; // Cache expiry time in seconds (1 hour)

/**
 * Utility function to handle Redis watch cleanup
 * Ensures Redis watch is properly unwatched in case of errors
 */
const safeUnwatch = async () => {
	try {
		await redis.unwatch();
	} catch (error) {
		console.error("Error unwatching Redis:", error);
	}
};

/**
 * Utility function to validate accommodation ID
 * @param {any} accommodationId - The accommodation ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidAccommodationId = (accommodationId) => {
	const id = Number(accommodationId);
	return !isNaN(id) && id > 0;
};

/**
 * Utility function to store command in Redis history
 * @param {string} userId - User ID
 * @param {string} commandType - Type of command
 * @param {number} accommodationId - Accommodation ID
 * @returns {Promise<boolean>} - Success status
 */
const storeCommandInHistory = async (userId, commandType, accommodationId) => {
	try {
		const commandData = { type: commandType, userId, accommodationId };
		const multi = redis.multi();
		multi.lpush(`command:history:${userId}`, JSON.stringify(commandData));
		multi.ltrim(`command:history:${userId}`, 0, HISTORY_LIMIT - 1);
		const execResult = await multi.exec();

		if (!execResult) {
			console.warn(`Command storage transaction failed for userId=${userId}, accommodationId=${accommodationId}`);
			return false;
		}
		return true;
	} catch (error) {
		console.error("Error storing command in history:", error);
		return false;
	}
};

/**
 * Utility function to check for duplicate commands
 * @param {string} userId - User ID
 * @param {string} commandType - Type of command to check for
 * @param {number} accommodationId - Accommodation ID
 * @returns {Promise<boolean>} - True if duplicate found, false otherwise
 */
const isDuplicateCommand = async (userId, commandType, accommodationId) => {
	try {
		const lastCommand = await redis.lindex(`command:history:${userId}`, 0);
		if (!lastCommand) return false;

		const parsedCommand = JSON.parse(lastCommand);
		return parsedCommand.accommodationId === accommodationId && parsedCommand.type === commandType;
	} catch (error) {
		console.error("Error checking for duplicate command:", error);
		return false;
	}
};

/**
 * Standard error response format
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 */
const sendErrorResponse = (res, statusCode, message) => {
	return res.status(statusCode).json({
		success: false,
		error: { code: statusCode, message },
	});
};

/**
 * Standard success response format
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {any} payload - Response payload
 */
const sendSuccessResponse = (res, message, payload) => {
	return res.status(200).json({
		success: true,
		message,
		payload,
	});
};

export default {
	// Get user's favourite list
	async getFavouriteList(req, res) {
		try {
			// Extract and validate user ID from request
			const userId = req.user?.id;
			if (!userId) {
				return sendErrorResponse(res, 401, "Unauthorized");
			}

			// Retrieve favourite list from service
			const favList = await FavouriteService.findByUserId(userId);

			if (!favList) {
				return sendErrorResponse(res, 404, "Favourite list not found");
			}

			console.log(
				`Favourite list for userId=${userId}:`,
				favList.accommodations.map((a) => a.id)
			);

			return sendSuccessResponse(res, "Successfully retrieved user favourite list", favList);
		} catch (error) {
			console.error("Error retrieving favourite list:", error);
			return sendErrorResponse(res, 500, "Internal Server Error");
		}
	},

	// Add accommodation to user's favourites
	async addToFavourite(req, res) {
		try {
			// Extract and validate user ID from request object
			const userId = req.user?.id;
			if (!userId) {
				return sendErrorResponse(res, 401, "Unauthorized");
			}

			// Extract and validate accommodation ID from request body
			const accommodationId = Number(req.body.accommodationId);
			if (!isValidAccommodationId(accommodationId)) {
				return sendErrorResponse(res, 400, "Invalid accommodation ID");
			}

			console.log(`Adding favourite: userId=${userId}, accommodationId=${accommodationId}`);

			// Watch Redis key for transaction safety
			await redis.watch(`command:history:${userId}`);

			try {
				// Check for duplicate add commands
				const isDuplicate = await isDuplicateCommand(userId, "AddFavouriteCommand", accommodationId);

				if (isDuplicate) {
					console.log(`Duplicate add command detected for accommodationId=${accommodationId}, skipping storage`);
					await safeUnwatch();
					// Continue with execution but don't store in history
				}

				// Execute add favourite command
				const command = new AddFavouriteCommand(FavouriteService, userId, accommodationId);
				const result = await command.execute();

				// Store command in history if not duplicate
				if (!isDuplicate) {
					await storeCommandInHistory(userId, "AddFavouriteCommand", accommodationId);
				}

				await safeUnwatch();

				return sendSuccessResponse(res, "Successfully added to favourites", {
					accommodations: result.favouriteList,
				});
			} catch (commandError) {
				await safeUnwatch();
				throw commandError;
			}
		} catch (error) {
			console.error("Error adding to favourites:", error);
			await safeUnwatch();

			const statusCode = error.message.includes("already") ? 409 : 500;
			const message = error.message || "Internal Server Error";
			return sendErrorResponse(res, statusCode, message);
		}
	},

	// Remove accommodation from user's favourites
	async removeFromFavourite(req, res) {
		try {
			// Extract and validate user ID from request object
			const userId = req.user?.id;
			if (!userId) {
				return sendErrorResponse(res, 401, "Unauthorized");
			}

			// Extract and validate accommodation ID from request parameters
			const accommodationId = Number(req.params?.accommodationId);
			if (!isValidAccommodationId(accommodationId)) {
				return sendErrorResponse(res, 400, "Invalid accommodation ID");
			}

			console.log(`Removing accommodation: userId=${userId}, accommodationId=${accommodationId}`);

			// Watch Redis key for transaction safety
			await redis.watch(`command:history:${userId}`);

			try {
				// Check if accommodation exists in user's favourites
				const currentList = await FavouriteService.findByUserId(userId);
				const isInList = currentList.accommodations.some((a) => a.id === accommodationId);

				if (!isInList) {
					console.log(`AccommodationId=${accommodationId} not in list for userId=${userId}, rejecting request`);
					await safeUnwatch();
					return sendErrorResponse(res, 404, `Accommodation ${accommodationId} not in favourites`);
				}

				// Check for duplicate remove commands
				const isDuplicate = await isDuplicateCommand(userId, "RemoveFavouriteCommand", accommodationId);

				if (isDuplicate) {
					console.log(`Duplicate remove command detected for accommodationId=${accommodationId}, rejecting request`);
					await safeUnwatch();
					return sendErrorResponse(res, 409, `Duplicate remove request for accommodation ${accommodationId}`);
				}

				// Execute remove favourite command
				const command = new RemoveFavouriteCommand(FavouriteService, userId, accommodationId);
				const result = await command.execute();

				// Store command in history
				await storeCommandInHistory(userId, "RemoveFavouriteCommand", accommodationId);

				await safeUnwatch();

				console.log(
					`Favourite list after remove:`,
					result.favouriteList.map((a) => a.id)
				);

				return sendSuccessResponse(res, "Successfully removed from favourites", {
					accommodations: result.favouriteList,
				});
			} catch (commandError) {
				await safeUnwatch();
				throw commandError;
			}
		} catch (error) {
			console.error("Error removing from favourites:", error);
			await safeUnwatch();

			const statusCode = error.message.includes("not in") ? 404 : 500;
			const message = error.message || "Internal Server Error";
			return sendErrorResponse(res, statusCode, message);
		}
	},

	// Undo the last favourite operation (add/remove)
	async undo(req, res) {
		try {
			// Extract and validate user ID from request object
			const userId = req.user?.id;
			if (!userId) {
				return sendErrorResponse(res, 401, "Unauthorized");
			}

			// Check Redis connection status
			if (redis.status !== "ready") {
				return sendErrorResponse(res, 503, "Redis service unavailable");
			}

			console.log("Redis history before undo:", await redis.lrange(`command:history:${userId}`, 0, -1));

			// Watch Redis key for transaction safety
			await redis.watch(`command:history:${userId}`);

			try {
				// Get command history
				const history = await redis.lrange(`command:history:${userId}`, 0, -1);

				if (!history.length) {
					await safeUnwatch();
					return sendErrorResponse(res, 400, "No commands to undo");
				}

				// Get current favourite list for validation
				const currentList = await FavouriteService.findByUserId(userId);
				let validCommandFound = false;
				let commandToExecute = null;
				let executedType = null;
				let commandToRemove = null;

				// Find the first valid command to undo
				for (let i = 0; i < history.length; i++) {
					let commandInfo;

					try {
						commandInfo = JSON.parse(history[i]);
						console.log("Parsed command:", commandInfo);
					} catch (parseError) {
						console.error("Error parsing command data:", parseError);
						continue; // Skip invalid command
					}

					const { type, userId: cmdUserId, accommodationId } = commandInfo;

					// Validate command data
					if (!type || !cmdUserId || !accommodationId) {
						console.error("Incomplete command data:", commandInfo);
						continue; // Skip incomplete command
					}

					console.log(`Processing command: type=${type}, userId=${cmdUserId}, accommodationId=${accommodationId}`);

					// Handle RemoveFavouriteCommand undo (re-add to favourites)
					if (type === "RemoveFavouriteCommand") {
						// Check if accommodation is not currently in favourites (can be undone)
						if (!currentList.accommodations.some((a) => a.id === accommodationId)) {
							commandToExecute = new AddFavouriteCommand(FavouriteService, cmdUserId, accommodationId);
							validCommandFound = true;
							executedType = type;
							commandToRemove = history[i];
							break;
						} else {
							console.log(`Skipping undo of RemoveFavouriteCommand for accommodationId=${accommodationId} as it is already in list`);
						}
					}
					// Handle AddFavouriteCommand undo (remove from favourites)
					else if (type === "AddFavouriteCommand") {
						// Check if accommodation is currently in favourites (can be undone)
						if (currentList.accommodations.some((a) => a.id === accommodationId)) {
							commandToExecute = new RemoveFavouriteCommand(FavouriteService, cmdUserId, accommodationId);
							validCommandFound = true;
							executedType = type;
							commandToRemove = history[i];
							break;
						} else {
							console.log(`Skipping undo of AddFavouriteCommand for accommodationId=${accommodationId} as it is not in list`);
						}
					}
				}

				if (!validCommandFound) {
					await safeUnwatch();
					return sendErrorResponse(res, 400, "No valid commands to undo");
				}

				// Execute the undo command
				const result = await commandToExecute.execute();

				// Remove the undone command from history
				await redis.lrem(`command:history:${userId}`, 1, commandToRemove);

				// Update cache with new favourite list
				await redis.set(`favourite:user:${userId}`, JSON.stringify(result.favouriteList), "EX", CACHE_EXPIRY);

				await safeUnwatch();

				console.log(
					"Favourite list after undo:",
					result.favouriteList.map((a) => a.id)
				);

				return sendSuccessResponse(res, `Successfully undid ${executedType}`, {
					accommodations: result.favouriteList,
				});
			} catch (undoError) {
				await safeUnwatch();
				throw undoError;
			}
		} catch (error) {
			console.error("Error undoing favourite command:", error);
			await safeUnwatch();

			let statusCode = 500;
			if (error.message.includes("already in")) {
				statusCode = 409;
			} else if (error.message.includes("not in")) {
				statusCode = 404;
			}

			const message = error.message || "Internal Server Error";
			return sendErrorResponse(res, statusCode, message);
		}
	},
};
