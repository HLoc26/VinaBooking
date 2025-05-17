import NodeMailerClient from "../clients/NodeMailerClient.js";

export default {
	async sendOTP(to, otp) {
		const mailTransporter = NodeMailerClient.getClient();

		try {
			const info = await mailTransporter.sendMail({
				from: `"VinaBooking HCMUTE No-Reply" <${process.env.MAIL_USER}>`,
				to,
				subject: "Your OTP Code",
				html: `<h3>Your OTP is:</h3><p style="font-size: 20px; font-weight: bold;">${otp}</p><p>This OTP will expire in 5 minutes.</p>`,
			});
			// console.log("Email sent:", info.messageId);
			return { success: true, info };
		} catch (error) {
			console.error("Failed to send email:", error);
			throw error;
		}
	},
};
