import sequelize from "../config/sequelize.js";
import "../database/models/index.js";
import logger from "../helpers/Logger.js";

const args = process.argv.slice(2);
const useAlter = args.includes("--alter");
const useForce = args.includes("--force");

const run = async () => {
	try {
		logger.info(`Syncing database... (alter: ${useAlter}, force: ${useForce})`);

		if (useAlter && useForce) {
			throw new Error("You can't use --alter and --force together. Pick one.");
		}

		await sequelize.sync({
			alter: useAlter,
			force: useForce,
			logging: console.log, // This will show the SQL queries being executed
		});

		logger.success("Database synced successfully.");
		process.exit(0);
	} catch (err) {
		logger.error("Sync failed:", err.message || err);
		process.exit(1);
	}
};

await run();
