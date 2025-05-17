import Redis from "ioredis";

class RedisClient {
	constructor() {
		if (RedisClient.instance) {
			return RedisClient.instance;
		}

		this.client = new Redis(process.env.REDIS_CONN_STR);

		this.client.on("connecting", () => {
			console.log("Connecting to Redis Client");
		});

		this.client.on("connect", () => {
			console.log("Connected to Redis Client");
		});

		this.client.on("error", (err) => {
			console.log("Error from Redis Client", err);
		});

		RedisClient.instance = this;
	}

	getClient() {
		return this.client;
	}
}

export default new RedisClient();
