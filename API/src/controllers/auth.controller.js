// controllers/auth.controller.js
import authService from "../services/auth.service.js";
export default {
	async requestOTP(req, res) {
		const { emailOrPhone } = req.body;
		const otp = await authService.generateOTP(emailOrPhone);

		// Normally send the OTP using a mail/SMS service
		console.log(`Generated OTP for ${emailOrPhone}: ${otp}`);

		res.status(200).json({ message: "OTP sent successfully" });
	},

	async confirmOTP(req, res) {
		const { emailOrPhone, otp } = req.body;
		const result = await authService.validateOTP(emailOrPhone, otp);

		if (!result.valid) {
			return res.status(400).json({ message: result.message });
		}

		res.status(200).json({ message: result.message });
	},
};
