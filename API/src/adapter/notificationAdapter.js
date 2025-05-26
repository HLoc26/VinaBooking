import { NotificationService } from "../services/notification.service.js";

class INotificationAdapter {
	async send(identifier, otp) {
		throw new Error("send() not implemented");
	}
}

class EmailChannel extends INotificationAdapter {
	async send(identifier, otp) {
		return NotificationService.sendOTPEmail(identifier, otp);
	}
}

class SmsChannel extends INotificationAdapter {
	async send(identifier, otp) {
		// Future implementation for SMS
		// const phone = formatPhoneNumber(identifier)
		// return NotificationService.sendOTPSMS(phone, otp)
		throw new Error("SMS channel not implemented yet");
	}
}

class ZaloChannel extends INotificationAdapter {
	async send(identifier, otp) {
		// Future implementation for Zalo
		// const zaloId = toZaloId(identifier)
		// return NotificationService.sendOTPZalo(zaloId, otp)
		throw new Error("Zalo channel not implemented yet");
	}
}

export const NotificationAdapters = {
	email: new EmailChannel(),
	sms: new SmsChannel(),
	zalo: new ZaloChannel(),
};
