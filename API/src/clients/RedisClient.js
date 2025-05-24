import Redis from "ioredis";
import logger from "../helpers/Logger.js";

class RedisClient {
	constructor() {
		if (RedisClient.instance) {
			return RedisClient.instance;
		}

		this.client = new Redis(process.env.REDIS_CONN_STR);

		this.client.on("connecting", () => {
			logger.info("Connecting to Redis Client");
		});

		this.client.on("connect", () => {
			logger.success("Connected to Redis Client");
		});

		this.client.on("error", (err) => {
			console.error("Error from Redis Client", err);
		});

		RedisClient.instance = this;
	}

	getClient() {
		return this.client;
	}
}

export default new RedisClient();
