import authService from "../services/auth.service.js";
import logger from "../helpers/Logger.js";

export default {
	// Handles user authentication requests
	async login(req, res) {
		const { email, password, rememberMe } = req.body;

		try {
			const result = await authService.login(email, password, rememberMe);

			if (!result.success) {
				logger.error(`[LOGIN] Authentication failed`);
				return res.status(result.error.code).json({ success: false, error: result.error });
			}

			logger.success(`[LOGIN] Authentication successful`);

			// Set JWT as HTTP-only cookie
			const token = result.payload.jwt;

			// Set cookie expiration based on rememberMe flag
			const maxAge = rememberMe
				? 30 * 24 * 60 * 60 * 1000 // 30 days for "Remember Me"
				: 24 * 60 * 60 * 1000; // 1 day for normal login

			res.cookie("jwt", token, {
				httpOnly: true,
				secure: true, // only send over HTTPS in production
				sameSite: "none",
				maxAge: maxAge,
			}); // Only send user info in payload, not the JWT token
			return res.status(200).json({
				success: true,
				message: "Login success",
				payload: {
					user: result.payload.user,
					rememberMe,
					rememberMe,
				},
			});
		} catch (err) {
			logger.error(`[LOGIN] Server error during authentication`);
			return res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: "Server error",
					details: err.message,
					stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
				},
			});
		}
	},
	async initiateRegistration(req, res) {
		try {
			const { name, phone, email, password, role, gender, dob } = req.body;

			const result = await authService.initiateRegistration({ name, phone, email, password, role, gender, dob });

			if (!result.success) {
				return res.status(result.error.code).json({ success: false, error: result.error });
			}
			return res.status(200).json({
				success: true,
				message: "OTP sent to email. Please confirm to complete registration.",
			return res.status(200).json({
				success: true,
				message: "OTP sent to email. Please confirm to complete registration.",
			});
		} catch (error) {
			logger.error("Registration initiation failed:", error);
			return res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: "Internal Server Error",
				},
			});
		}
	},
	async completeRegistration(req, res) {
		try {
			const { email, otp } = req.body;

			const result = await authService.completeRegistration(email, otp);

			if (!result.success) {
				return res.status(result.error.code).json({ success: false, error: result.error });
			}
			return res.status(201).json({
				success: true,
				message: "Account created successfully. You can now log in.",
			return res.status(201).json({
				success: true,
				message: "Account created successfully. You can now log in.",
			});
		} catch (error) {
			logger.error("Registration confirmation failed:", error);
			return res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: "Internal Server Error",
				},
			});
		}
	},

	async getCurrentUser(req, res) {
		try {
			// User information is already attached to req.user by the auth middleware
			if (!req.user) {
				return res.status(401).json({
					success: false,
					error: {
						code: 401,
						message: "Not authenticated",
					},
				});
			}

			// Get the complete user data
			const user = await authService.getUserById(req.user.id);
			if (!user) {
				return res.status(404).json({
					success: false,
					error: {
						code: 404,
						message: "User not found",
					},
				});
			}

			return res.status(200).json({
				success: true,
				payload: authService.sanitizeUser(user),
			});
		} catch (error) {
			logger.error("Error in getCurrentUser:", error);
			return res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: "Server error",
					details: error.message,
				},
			});
		}
	},

	async logout(req, res) {
		try {
			// Clear the JWT cookie
			res.clearCookie("jwt", {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
			});

			return res.status(200).json({
				success: true,
				message: "Logout successful",
			});
		} catch (error) {
			logger.error("Error in logout:", error);
			return res.status(500).json({
				success: false,
				error: {
					code: 500,
					message: "Server error",
					details: error.message,
				},
			});
		}
	},
};
