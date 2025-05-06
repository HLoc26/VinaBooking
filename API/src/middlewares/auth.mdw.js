import jwt from "jsonwebtoken";
import "dotenv/config";

export default {
	decodeJwt(req, res, next) {
		try {
			let token;
			
			// Check for token in cookies (preferred method)
			if (req.cookies && req.cookies.jwt) {
				token = req.cookies.jwt;
			} 
			// Fall back to Authorization header if cookie isn't present
			else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
				token = req.headers.authorization.split(" ")[1];
			}
			
			if (!token) {
				return res.status(401).json({
					success: false,
					error: { code: 401, message: "No authentication token provided" },
				});
			}

			const user = jwt.verify(token, process.env.JWT_SECRET);
			req.user = user;
			next();
		} catch (error) {
			console.log("JWT verification error:", error.message);

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
