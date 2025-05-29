import FavouriteService from "../services/favourite.service.js";
import AddFavouriteCommand from "../classes/commands/AddFavouriteCommand.js";
import RemoveFavouriteCommand from "../classes/commands/RemoveFavouriteCommand.js";
import RedisClient from "../clients/RedisClient.js";

const redis = RedisClient.getClient();
const HISTORY_LIMIT = 10; // Maximum number of commands to keep in history

export default {
	async getFavouriteList(req, res) {
		try {
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ success: false, error: { code: 401, message: "Unauthorized" } });

			const favList = await FavouriteService.findByUserId(userId);

			if (!favList) {
				return res.status(404).json({
					success: false,
					error: { code: 404, message: "FavouriteList not found" },
				});
			}
			console.log(
				`Favourite list for userId=${userId}:`,
				favList.accommodations.map((a) => a.id)
			);
			return res.status(200).json({
				success: true,
				message: "Successfully retrieved user favourite list",
				payload: favList,
			});
		} catch (error) {
			console.error("Error retrieving favourite list:", error);
			return res.status(500).json({
				success: false,
				error: { code: 500, message: "Internal Server Error" },
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
					error: { code: 400, message: "Invalid accommodation ID" },
				});
			}

			console.log(`Adding favourite: userId=${userId}, accommodationId=${accommodationId}`);

			const command = new AddFavouriteCommand(FavouriteService, userId, accommodationId);
			const result = await command.execute();

			await redis.watch(`command:history:${userId}`);
			const lastCommand = await redis.lindex(`command:history:${userId}`, 0);
			if (lastCommand && JSON.parse(lastCommand).accommodationId === accommodationId && JSON.parse(lastCommand).type === "AddFavouriteCommand") {
				console.log(`Duplicate add command detected for accommodationId=${accommodationId}, skipping storage`);
				await redis.unwatch();
			} else {
				const commandData = { type: "AddFavouriteCommand", userId, accommodationId };
				const multi = redis.multi();
				multi.lpush(`command:history:${userId}`, JSON.stringify(commandData));
				multi.ltrim(`command:history:${userId}`, 0, HISTORY_LIMIT - 1);
				const execResult = await multi.exec();
				if (!execResult) {
					console.warn(`AddFavourite transaction failed for userId=${userId}, accommodationId=${accommodationId}`);
				}
				await redis.unwatch();
			}

			return res.status(200).json({
				success: true,
				message: "Successfully added to favourites",
				payload: { accommodations: result.favouriteList },
			});
		} catch (error) {
			console.error("Error adding to favourites:", error);
			await redis.unwatch();
			const statusCode = error.message.includes("already") ? 409 : 500;
			return res.status(statusCode).json({
				success: false,
				error: { code: statusCode, message: error.message || "Internal Server Error" },
			});
		}
	},

	async removeFromFavourite(req, res) {
		try {
			// Extract userId from request object
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ success: false, error: { code: 401, message: "Unauthorized" } });

			// Extract accommodationId from request parameters
			const accommodationId = +req.params?.accommodationId;
			if (!accommodationId || isNaN(accommodationId) || accommodationId <= 0) {
				return res.status(400).json({
					success: false,
					error: { code: 400, message: "Invalid accommodation ID" },
				});
			}

			console.log(`Removing accommodation: userId=${userId}, accommodationId=${accommodationId}`);

			await redis.watch(`command:history:${userId}`);
			const currentList = await FavouriteService.findByUserId(userId);
			const isInList = currentList.accommodations.some((a) => a.id === accommodationId);
			const lastCommand = await redis.lindex(`command:history:${userId}`, 0);
			const isDuplicate = lastCommand && JSON.parse(lastCommand).accommodationId === accommodationId && JSON.parse(lastCommand).type === "RemoveFavouriteCommand";

			if (!isInList) {
				console.log(`AccommodationId=${accommodationId} not in list for userId=${userId}, rejecting request`);
				await redis.unwatch();
				return res.status(404).json({
					success: false,
					error: { code: 404, message: `Accommodation ${accommodationId} not in favourites` },
				});
			}

			if (isDuplicate) {
				console.log(`Duplicate remove command detected for accommodationId=${accommodationId}, rejecting request`);
				await redis.unwatch();
				return res.status(409).json({
					success: false,
					error: { code: 409, message: `Duplicate remove request for accommodation ${accommodationId}` },
				});
			}

			const command = new RemoveFavouriteCommand(FavouriteService, userId, accommodationId);
			const result = await command.execute();

			// Save command to Redis history
            const commandData = { type: "RemoveFavouriteCommand", userId, accommodationId };
			const multi = redis.multi();
			multi.lpush(`command:history:${userId}`, JSON.stringify(commandData));
			multi.ltrim(`command:history:${userId}`, 0, HISTORY_LIMIT - 1);
			const execResult = await multi.exec();
			if (!execResult) {
				console.warn(`RemoveFavourite transaction failed for userId=${userId}, accommodationId=${accommodationId}`);
			}
			await redis.unwatch();

			console.log(
				`Favourite list after remove:`,
				result.favouriteList.map((a) => a.id)
			);
			return res.status(200).json({
				success: true,
				message: "Successfully removed from favourites",
				payload: { accommodations: result.favouriteList },
			});
		} catch (error) {
			console.error("Error removing from favourites:", error);
			await redis.unwatch();
			const statusCode = error.message.includes("not in") ? 404 : 500;
			return res.status(statusCode).json({
				success: false,
				error: { code: statusCode, message: error.message || "Internal Server Error" },
			});
		}
	},

	async undo(req, res) {
		try {
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ success: false, error: { code: 401, message: "Unauthorized" } });

			// Kiểm tra kết nối Redis
			if (redis.status !== "ready") {
				return res.status(503).json({
					success: false,
					error: { code: 503, message: "Redis service unavailable" },
				});
			}

			console.log("Redis history before undo:", await redis.lrange(`command:history:${userId}`, 0, -1));

			await redis.watch(`command:history:${userId}`);
			const history = await redis.lrange(`command:history:${userId}`, 0, -1);
			if (!history.length) {
				await redis.unwatch();
				return res.status(400).json({
					success: false,
					error: { code: 400, message: "No commands to undo" },
				});
			}

			let validCommandFound = false;
			let commandInfo;
			let executedType;
			let command;

			// Find the latest RemoveFavouriteCommand
			for (let i = 0; i < history.length; i++) {
				try {
					commandInfo = JSON.parse(history[i]);
					console.log("Parsed command:", commandInfo);
				} catch (parseError) {
					console.error("Error parsing command data:", parseError);
					continue; // Skip invalid command
				}

				const { type, userId: cmdUserId, accommodationId } = commandInfo;
				if (!type || !cmdUserId || !accommodationId) {
					console.error("Incomplete command data:", commandInfo);
					continue; // Skip incomplete command
				}

				console.log(`Processing command: type=${type}, userId=${cmdUserId}, accommodationId=${accommodationId}`);

				const currentList = await FavouriteService.findByUserId(userId);

				if (type === "RemoveFavouriteCommand") {
					if (currentList.accommodations.some((a) => a.id === accommodationId)) {
						console.log(`Skipping undo of RemoveFavouriteCommand for accommodationId=${accommodationId} as it is already in list`);
						continue; // Try next command
					}
					command = new AddFavouriteCommand(FavouriteService, cmdUserId, accommodationId);
					validCommandFound = true;
					executedType = type;

					// Remove this command from history
					await redis.lrem(`command:history:${userId}`, 1, history[i]);
					break;
				}
			}

			// If no valid RemoveFavouriteCommand, try AddFavouriteCommand
			if (!validCommandFound) {
				for (let i = 0; i < history.length; i++) {
					try {
						commandInfo = JSON.parse(history[i]);
						console.log("Parsed command:", commandInfo);
					} catch (parseError) {
						console.error("Error parsing command data:", parseError);
						continue; // Skip invalid command
					}

					const { type, userId: cmdUserId, accommodationId } = commandInfo;
					if (!type || !cmdUserId || !accommodationId) {
						console.error("Incomplete command data:", commandInfo);
						continue; // Skip incomplete command
					}

					console.log(`Processing command: type=${type}, userId=${cmdUserId}, accommodationId=${accommodationId}`);

					const currentList = await FavouriteService.findByUserId(userId);

					if (type === "AddFavouriteCommand") {
						if (!currentList.accommodations.some((a) => a.id === accommodationId)) {
							console.log(`Skipping undo of AddFavouriteCommand for accommodationId=${accommodationId} as it is not in list`);
							continue; // Try next command
						}
						command = new RemoveFavouriteCommand(FavouriteService, cmdUserId, accommodationId);
						validCommandFound = true;
						executedType = type;

						// Remove this command from history
						await redis.lrem(`command:history:${userId}`, 1, history[i]);
						break;
					}
				}
			}

			if (!validCommandFound) {
				await redis.unwatch();
				return res.status(400).json({
					success: false,
					error: { code: 400, message: "No valid commands to undo" },
				});
			}

			// Thực thi hoàn tác
			const result = await command.execute();

			// Cập nhật cache Redis
			await redis.set(`favourite:user:${userId}`, JSON.stringify(result.favouriteList), "EX", 3600);
			await redis.unwatch();

			console.log(
				"Favourite list after undo:",
				result.favouriteList.map((a) => a.id)
			);
			return res.status(200).json({
				success: true,
				message: `Successfully undid ${executedType}`,
				payload: { accommodations: result.favouriteList },
			});
		} catch (error) {
			console.error("Error undoing favourite command:", error);
			await redis.unwatch();
			const statusCode = error.message.includes("already in") ? 409 : error.message.includes("not in") ? 404 : 500;
			return res.status(statusCode).json({
				success: false,
				error: { code: statusCode, message: error.message || "Internal Server Error" },
			});
		}
	},
};
