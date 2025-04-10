import express, { urlencoded } from "express";
import cors from "cors";
import router from "./routes/index.routes.js";
import sequelize from "./config/sequelize.js";
import "./database/models/associations.js";

const app = express();

app.use(urlencoded({ extended: true }));

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
// ======================= LOGGING =======================
// Middleware to log request
app.use((req, res, next) => {
	const startTime = Date.now();

	// Log request details
	console.log(`[Request] ${req.ip} -> ${req.method} ${req.originalUrl}`);

	// Log response details when the request is completed
	res.on("finish", () => {
		const duration = Date.now() - startTime;
		console.log(`[Response] ${res.statusCode} (${duration}ms)`);
	});

	next();
});

// ======================= ROUTES ========================
app.use("/api", router);

// ================= DATABASE CONNECTION =================
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

async function connectWithRetry(retries = MAX_RETRIES) {
	try {
		await sequelize.authenticate();
		console.log("Database connection established successfully.");

		// Sync database models
		console.log("Syncing database models...");
		await sequelize.sync({ alter: true, force: false }); // Use { force: true } to drop and recreate tables
		console.log("Database models synchronized successfully.");

		return true;
	} catch (error) {
		console.error("Unable to connect to the database:", error.message);

		if (retries > 0) {
			console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds... (${retries} attempts remaining)`);
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
			return connectWithRetry(retries - 1);
		}

		console.error("Max retries reached. Could not connect to database.");
		return false;
	}
}

try {
	const dbConnected = await connectWithRetry();
	if (!dbConnected) {
		throw new Error("Failed to connect to database after max retries");
	}

	app.listen(3000, "0.0.0.0", () => {
		console.log("Listening on http://localhost:3000");
	});
} catch (error) {
	console.error("Server initialization failed:", error.message);
	process.exit(1);
}
