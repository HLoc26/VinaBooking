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

			// Save command to Redis history
            const commandData = { type: "AddFavouriteCommand", userId, accommodationId };
			const multi = redis.multi();
			multi.lpush(`command:history:${userId}`, JSON.stringify(commandData));
			multi.ltrim(`command:history:${userId}`, 0, HISTORY_LIMIT - 1);
			await multi.exec();

			if (result) {
				return res.status(200).json({
					success: true,
					message: "Successfully added to favourites",
					payload: { accommodations: result.favouriteList },
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

			// Save command to Redis history
            const commandData = { type: "RemoveFavouriteCommand", userId, accommodationId };
			const multi = redis.multi();
			multi.lpush(`command:history:${userId}`, JSON.stringify(commandData));
			multi.ltrim(`command:history:${userId}`, 0, HISTORY_LIMIT - 1);
			await multi.exec();

			if (result) {
				return res.status(200).json({
					success: true,
					message: "Successfully removed from favourites",
					payload: { accommodations: result.favouriteList },
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

			// Lấy lệnh cuối từ lịch sử
			const commandData = await redis.rpop(`command:history:${userId}`);
			if (!commandData) {
				return res.status(400).json({
					success: false,
					error: { code: 400, message: "No commands to undo" },
				});
			}

			// Phân tích lệnh
			let commandInfo;
			try {
				commandInfo = JSON.parse(commandData);
			} catch (parseError) {
				console.error("Error parsing command data:", parseError);
				return res.status(500).json({
					success: false,
					error: { code: 500, message: "Invalid command data" },
				});
			}

			const { type, userId: cmdUserId, accommodationId } = commandInfo;
			if (!type || !cmdUserId || !accommodationId) {
				return res.status(400).json({
					success: false,
					error: { code: 400, message: "Incomplete command data" },
				});
			}

			// Ghi log để debug
			console.log("Undoing command:", { type, userId: cmdUserId, accommodationId });

			// Tạo lệnh hoàn tác
			let command;
			if (type === "AddFavouriteCommand") {
				command = new RemoveFavouriteCommand(FavouriteService, cmdUserId, accommodationId);
			} else if (type === "RemoveFavouriteCommand") {
				command = new AddFavouriteCommand(FavouriteService, cmdUserId, accommodationId);
			} else {
				return res.status(400).json({
					success: false,
					error: { code: 400, message: "Invalid command type" },
				});
			}

			// Thực thi hoàn tác
			const result = await command.execute();

			// Cập nhật cache Redis
			await redis.set(`favourite:user:${userId}`, JSON.stringify(result.favouriteList), "EX", 3600);

			return res.status(200).json({
				success: true,
				message: `Successfully undid ${type}`,
				payload: { accommodations: result.favouriteList },
			});
		} catch (error) {
			console.error("Error undoing favourite command:", error);
			const statusCode = error.message.includes("already in") ? 409 : error.message.includes("not in") ? 404 : 500;
			return res.status(statusCode).json({
				success: false,
				error: { code: statusCode, message: error.message || "Internal Server Error" },
			});
		}
	},
};
