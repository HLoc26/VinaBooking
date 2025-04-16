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
	async send({ to, subject, html }) {
		try {
			const info = await transporter.sendMail({
				from: `"No Reply" <${process.env.MAIL_USER}>`,
				to,
				subject,
				html,
			});
			console.log("📨 Email sent:", info.messageId);
			return { success: true, info };
		} catch (error) {
			console.error("❌ Failed to send email:", error);
			throw error;
		}
	},
};
