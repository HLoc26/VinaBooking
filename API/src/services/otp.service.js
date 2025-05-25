import RedisClient from "../clients/RedisClient.js";

const OTP_EXPIRATION = parseInt(process.env.OTP_EXPIRATION) || 300; // 5 phút
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS) || 5;
const ATTEMPT_EXPIRATION = parseInt(process.env.OTP_ATTEMPT_EXPIRATION) || 600;

const OtpService = {
	async generate(identifier) {
		const redis = RedisClient.getClient();
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		await redis.setex(`otp:${identifier}`, OTP_EXPIRATION, otp);
		await redis.setex(`otp_attempts:${identifier}`, ATTEMPT_EXPIRATION, 0);
		return otp;
	},

	async validate(identifier, submittedOtp) {
		const redis = RedisClient.getClient();

		const otpKey = `otp:${identifier}`;
		const attemptsKey = `otp_attempts:${identifier}`;

		const storedOtp = await redis.get(otpKey);
		if (!storedOtp) return { valid: false, message: "OTP expired or not found" };

		let attempts = parseInt(await redis.get(attemptsKey)) || 0;
		if (attempts >= OTP_MAX_ATTEMPTS) {
			await redis.del(otpKey);
			await redis.del(attemptsKey);
			return { valid: false, message: "Too many incorrect attempts. OTP has been invalidated." };
		}

		if (storedOtp !== submittedOtp) {
			await redis.incr(attemptsKey);
			await redis.expire(attemptsKey, ATTEMPT_EXPIRATION);
			return { valid: false, message: `Incorrect OTP. Attempts remaining: ${OTP_MAX_ATTEMPTS - attempts - 1}` };
		}

		await redis.del(otpKey);
		await redis.del(attemptsKey);
		return { valid: true, message: "OTP verified successfully" };
	},
};

export default OtpService;
