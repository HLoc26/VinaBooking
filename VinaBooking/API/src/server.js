import express from "express";
import router from "./routes/index.routes.js";

const app = express();

// Oh, can't read req.body?

// Oh no, got CORS...

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

app.use("/api", router);

app.listen(3000, "0.0.0.0", () => {
	console.log("Listening on http://localhost:3000");
});
