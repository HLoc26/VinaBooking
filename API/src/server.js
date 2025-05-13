import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.routes.js";
import sequelize from "./config/sequelize.js";
import "./database/models/index.js";
import "dotenv/config";

const app = express();

// This line is important for parsing JSON request bodies!
app.use(express.json());

app.use(urlencoded({ extended: true }));

// Add cookie-parser middleware to parse cookies
app.use(cookieParser());

// ======================= CORS =========================
app.use(
	cors({
		origin: ["http://localhost:5173", process.env.UI_PATH],
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

		// Check if the response status is not 200
		if (res.statusCode !== 200) {
			let errorDetails = `[Error] ${res.statusCode} ${res.statusMessage || ""} - ${req.originalUrl} (${duration}ms)`;

			// Log additional error details if status code is 4xx or 5xx
			if (res.statusCode >= 400 && res.statusCode < 500) {
				errorDetails += `\nClient Error: Likely an issue with the request sent by the client.`;
			} else if (res.statusCode >= 500) {
				errorDetails += `\nServer Error: Something went wrong on the server side.`;
			}

			// Log the error
			console.error(errorDetails);

			// Optionally, you can send an error response to the client if needed
			// res.status(res.statusCode).json({ message: 'Something went wrong, please try again.' });
		} else {
			// Log the success response if status code is 200
			console.log(`[Response] ${res.statusCode} (${duration}ms): ${req.originalUrl}`);
		}
	});

	// Proceed to next middleware
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

	const HOST = process.env.HOST || "0.0.0.0";
	const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

	app.listen(+process.env.PORT, process.env.HOST, () => {
		console.log(`Listening on https://${HOST}:${PORT}`);
	});
} catch (error) {
	console.error("Server initialization failed:", error.message);
	process.exit(1);
}
