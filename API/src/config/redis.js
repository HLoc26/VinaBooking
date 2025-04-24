// config/redis.js
import Redis from "ioredis";

const redis = new Redis({
	host: "redis",
	port: process.env.REDIS_PORT || 6379,
	password: process.env.REDIS_PASSWORD || "",
	connectionTimeout: 10000, // 10 seconds
});

export default redis; // default export
