import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

export default {
	async sendOTP(to, otp) {
		try {
			const info = await transporter.sendMail({
				from: `"VinaBooking HCMUTE No-Reply" <${process.env.MAIL_USER}>`,
				to,
				subject: "Your OTP Code",
				html: `<h3>Your OTP is:</h3><p style="font-size: 20px; font-weight: bold;">${otp}</p><p>This OTP will expire in 5 minutes.</p>`,
			});
			console.log("Email sent:", info.messageId);
			return { success: true, info };
		} catch (error) {
			console.error("Failed to send email:", error);
			throw error;
		}
	},
};
