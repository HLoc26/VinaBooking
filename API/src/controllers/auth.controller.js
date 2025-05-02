import authService from "../services/auth.service.js";
import emailService from "../services/email.service.js";
export default {
	// Handles user authentication requests
	async login(req, res) {
		const { email, password } = req.body;

		try {
			const result = await authService.login(email, password);

			if (!result.success) {
				console.log(`[LOGIN] Authentication failed`);
				return res.status(result.error.code).json({ success: false, error: result.error });
			}

			console.log(`[LOGIN] Authentication successful`);

			// Set JWT as HTTP-only cookie
			const token = result.payload.jwt;
			res.cookie("jwt", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
				sameSite: "lax",
				maxAge: 24 * 60 * 60 * 1000, // 1 day
			});

			// Remove JWT from payload before sending to client
			const { jwt, ...payloadWithoutJwt } = result.payload;
			return res.json({
				success: true,
				message: "Login success",
				payload: payloadWithoutJwt,
			});
		} catch (err) {
			console.error(`[LOGIN] Server error during authentication`);
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
		const { name, phone, email, password, role, gender, dob, username, address } = req.body;

		try {
			const result = await authService.initiateRegistration({ name, phone, email, password, role, gender, dob, username, address });

			if (!result.success) {
				return res.status(result.error.code).json({ success: false, error: result.error });
			}
			res.status(200).json({ success: true, message: "OTP sent to email. Please confirm to complete registration." });
		} catch (error) {
			console.error("Registration initiation failed");
			res.status(500).json({ success: false, error: { code: 500, message: "Server error" } });
		}
	},

	async completeRegistration(req, res) {
		const { email, otp } = req.body;
		try {
			const result = await authService.completeRegistration(email, otp);
			if (!result.success) {
				return res.status(result.error.code).json({ success: false, error: result.error });
			}
			res.status(201).json({ success: true, message: "Account created successfully. You can now log in." });
		} catch (error) {
			console.error("Registration confirmation failed");
			res.status(500).json({ success: false, error: { code: 500, message: "Server error" } });
		}
	},
};
