// config/redis.js
import Redis from "ioredis";
import "dotenv/config";

const redis = new Redis(process.env.REDIS_CONN_STR);

export default redis; // default export
