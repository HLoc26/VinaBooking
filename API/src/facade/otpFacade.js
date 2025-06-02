import RedisClient from "../clients/RedisClient.js";
import OtpService from "../services/otp.service.js";
import { NotificationStrategies } from "../strategies/notificationStrategy.js";

class OtpFacade {
	async generateAndSend(identifier, userData, channel = "email") {
		try {
			const otp = await OtpService.generate(identifier);
			await RedisClient.getClient().setex(`pending_user:${identifier}`, 300, JSON.stringify(userData));
			const strategy = NotificationStrategies[channel];
			if (!strategy) {
				throw new Error(`Unsupported notification channel: ${channel}`);
			}
			await strategy.send(identifier, otp);
			return { success: true };
		} catch (error) {
			throw new Error(`Failed to generate and send OTP: ${error.message}`);
		}
	}

	async validate(identifier, submittedOtp) {
		return OtpService.validate(identifier, submittedOtp);
	}
}

export default new OtpFacade();
