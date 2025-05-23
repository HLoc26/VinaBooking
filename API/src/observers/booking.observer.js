import NodeMailerClient from "../clients/NodeMailerClient.js";

class BookingObserver {
	async update(eventData) {}
}

function formatBookingInfo(bookingInfo) {
	const { id, bookingItems, guest, startDate, endDate, guestCount, status } = bookingInfo;
	const roomList = bookingItems
		.map(
			(item) => `
      <li>
        <b>${item.room.name}</b> (x${item.count})<br/>
        Price: ${item.room.price} VND<br/>
        Description: ${item.room.description}
      </li>
    `
		)
		.join("");
	return `
    <h3>Booking Confirmation</h3>
    <p><b>Booking ID:</b> ${id}</p>
    <p><b>Guest:</b> ${guest.name} (${guest.email})</p>
    <p><b>Status:</b> ${status}</p>
    <p><b>Check-in:</b> ${new Date(startDate).toLocaleDateString()}</p>
    <p><b>Check-out:</b> ${new Date(endDate).toLocaleDateString()}</p>
    <p><b>Guests:</b> ${guestCount}</p>
    <p><b>Rooms:</b></p>
    <ul>${roomList}</ul>
  `;
}

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
			html: `
        <h3>You have a new booking!</h3>
        ${formatBookingInfo(bookingInfo)}
      `,
		});
	}
}

class BookingEvent {
	constructor() {
		this.observers = [];
	}
	add(observer) {
		this.observers.push(observer);
	}
	remove(observer) {
		this.observers = this.observers.filter((obs) => obs !== observer);
	}
	async notify(eventData) {
		for (const observer of this.observers) {
			await observer.update(eventData);
		}
	}
}

export { BookingObserver, TravellerNotifier, OwnerNotifier, BookingEvent };
