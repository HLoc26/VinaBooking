import nodemailer from "nodemailer";

class NodeMailerClient {
	constructor() {
		if (NodeMailerClient.instance) {
			return NodeMailerClient.instance;
		}

		this.client = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});

		NodeMailerClient.instance = this;
	}

	getClient() {
		return this.client;
	}

	async sendOTP(to, otp) {
		try {
			const info = await this.client.sendMail({
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
	}
}

export default new NodeMailerClient();
