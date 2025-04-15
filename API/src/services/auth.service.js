// services/auth.service.js
import redis from "../config/redis.js";

class AuthService {
	async generateOTP(identifier) {
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		await redis.setex(`otp:${identifier}`, 300, otp);
		return otp;
	}

	async validateOTP(identifier, submittedOtp) {
		const key = `otp:${identifier}`;
		const storedOtp = await redis.get(key);

		if (!storedOtp) return { valid: false, message: "OTP expired or not found" };
		if (storedOtp !== submittedOtp) return { valid: false, message: "Incorrect OTP" };

		await redis.del(key);
		return { valid: true, message: "OTP verified successfully" };
	}
}

const authService = new AuthService();
export default authService;
