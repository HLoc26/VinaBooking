import NodeMailerClient from "../../clients/NodeMailerClient.js";
import { BookingObserver } from "./BookingObserver.js";
import formatBookingInfo from "../../utils/formatBookingInfo.js";

class TravellerNotifier extends BookingObserver {
	async update(eventData) {
		const nodemailer = NodeMailerClient.getClient();
		const { travellerEmail, bookingInfo } = eventData;
		await nodemailer.sendMail({
			from: `"VinaBooking" <${process.env.MAIL_USER}>`,
			to: travellerEmail,
			subject: "Your Booking Confirmation",
			html: formatBookingInfo(bookingInfo),
		});
	}
}

class OwnerNotifier extends BookingObserver {
	async update(eventData) {
		const nodemailer = NodeMailerClient.getClient();
		const { ownerEmail, bookingInfo } = eventData;
		if (!ownerEmail) return;
		await nodemailer.sendMail({
			from: `"VinaBooking" <${process.env.MAIL_USER}>`,
			to: ownerEmail,
			subject: "New Booking Received",
			html: `<h3>You have a new booking!</h3>${formatBookingInfo(bookingInfo)}`,
		});
	}
}

export { TravellerNotifier, OwnerNotifier };
