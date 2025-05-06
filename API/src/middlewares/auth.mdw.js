import jwt from "jsonwebtoken";
import "dotenv/config";

export default {
	decodeJwt(req, res, next) {
		try {
			if (!req.headers.authorization) {
				return res.status(401).json({
					success: false,
					error: { code: 401, message: "No authorization token provided" },
				});
			}

			const token = req.headers.authorization.split(" ")[1];
			const user = jwt.verify(token, process.env.JWT_SECRET);
			req.user = user;
			next();
		} catch (error) {
			console.log(error.message);

			if (error.name === "TokenExpiredError") {
				return res.status(401).json({
					success: false,
					error: { code: 401, message: "Token expired" },
				});
			}

			if (error.name === "JsonWebTokenError") {
				return res.status(401).json({
					success: false,
					error: { code: 401, message: "Invalid token" },
				});
			}

			res.status(401).json({
				success: false,
				error: { code: 401, message: "Authentication failed" },
			});
		}
	},
};
