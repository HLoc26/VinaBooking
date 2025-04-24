import jwt from "jsonwebtoken";
import "dotenv/config";

export default {
	decodeJwt(req, res, next) {
		try {
			const token = req.headers.authorization.split(" ")[1];
			const user = jwt.verify(token, process.env.JWT_SECRET);
			req.user = user;
			next();
		} catch (error) {
			console.log(error.message);
			res.json({
				success: false,
				error: {
					code: 401,
					message: "Credentials invalid",
				},
			});
		}
	},
};
