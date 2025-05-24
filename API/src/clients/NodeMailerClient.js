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
}

export default new NodeMailerClient();
