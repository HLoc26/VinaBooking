import NodeMailerClient from "../clients/NodeMailerClient.js";

export const NotificationService = {
	async sendOTPEmail(to, otp) {
		return NodeMailerClient.sendOTP(to, otp);
	},

	// Send SMS OTP

	// Send Zalo OTP
};
