import authService from "../services/auth.service.js";
import emailService from "../services/email.service.js";
import User from "../classes/User.js";

export default {
	// Handles user authentication requests
	async login(req, res) {
		const { email, password } = req.body;
		try {
			const result = await authService.login(email, password);
			if (!result.success) {
				return res.status(result.error.code).json({ success: false, error: result.error });
			}
			return res.json({
				success: true,
				message: "Login success",
				payload: result.payload,
			});
		} catch (err) {
			console.error(err);
			return res.status(500).json({ success: false, error: { code: 500, message: "Server error" } });
		}
	},

	async initiateRegistration(req, res) {
		try {
			const { name, phone, email, password, role, gender, dob } = req.body;

			const result = await authService.initiateRegistration({ name, phone, email, password, role, gender, dob });

			if (!result.success) {
				return res.status(result.error.code).json({ success: false, error: result.error });
			}
			res.status(200).json({ success: true, message: "OTP sent to email. Please confirm to complete registration." });
		} catch (error) {
			console.error("Registration request failed:", error);
			res.status(500).json({ success: false, error: { code: 500, message: "Server error" } });
		}
	},

	async completeRegistration(req, res) {
		try {
			const { email, otp } = req.body;

			const result = await authService.completeRegistration(email, otp);

			if (!result.success) {
				return res.status(result.error.code).json({ success: false, error: result.error });
			}
			res.status(201).json({ success: true, message: "Account created successfully. You can now log in." });
		} catch (error) {
			console.error("Confirm registration failed:", error);
			res.status(500).json({ success: false, error: { code: 500, message: "Server error" } });
		}
	},
};
