// controllers/auth.controller.js
import authService from "../services/auth.service.js";
import emailService from "../services/email.service.js";
export default {
	async requestOTP(req, res) {
		const { email } = req.body;

		// Generate OTP using Redis
		const otp = await authService.generateOTP(email);

		try {
			// Send OTP via email
			await emailService.send({
				to: email,
				subject: "Your OTP Code",
				html: `<h3>Your OTP is:</h3><p style="font-size: 20px; font-weight: bold;">${otp}</p><p>This OTP will expire in 5 minutes.</p>`,
			});

			res.status(200).json({ message: "OTP sent successfully to email." });
		} catch (error) {
			console.error("Failed to send OTP:", error);
			res.status(500).json({ message: "Failed to send OTP email", error: error.message });
		}
	},

	async confirmOTP(req, res) {
		const { email, otp } = req.body;
		const result = await authService.validateOTP(email, otp);

		if (!result.valid) {
			return res.status(400).json({ message: result.message });
		}

		res.status(200).json({ message: result.message });
	},

	// ✉️ Mail test route logic
	async testMail(req, res) {
		const { to, subject, message } = req.body;

		try {
			await sendMail.send({
				to: to || "example@gmail.com", // Use a fixed email for testing
				subject: subject || "Hello",
				html: `<p>${message}</p>`,
			});

			res.status(200).json({ message: "Test email sent successfully!" });
		} catch (error) {
			console.error("Mail test error:", error);
			res.status(500).json({ message: "Failed to send test email", error: error.message });
		}
	},
};
