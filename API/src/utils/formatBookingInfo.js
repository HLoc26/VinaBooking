export default function formatBookingInfo(bookingInfo) {
	const { id, bookingItems, guest, startDate, endDate, guestCount, status } = bookingInfo;

	let accommodation = null;
	if (bookingItems.length > 0 && bookingItems[0].room.accommodation) {
		accommodation = bookingItems[0].room.accommodation;
	}

	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
	};

	const totalPrice = bookingItems.reduce((sum, item) => sum + item.room.price * item.count, 0);

	const roomList = bookingItems
		.map(
			(item) => `
                <div style="margin-bottom: 8px;">
                    <span style="font-weight:600;">${item.room.name}</span>
                    <span style="color:#6B7280;"> x${item.count}</span>
                    <span style="float:right;">${item.room.price.toLocaleString()} VND</span>
                    ${item.room.description ? `<div style="font-size:12px;color:#888;">${item.room.description}</div>` : ""}
                </div>
            `
		)
		.join("");

	return `
        <div style="font-family:Segoe UI,Arial,sans-serif;background:#fff;padding:0;margin:0;">
            <div style="max-width:480px;margin:24px auto;border-radius:12px;box-shadow:0 2px 8px #eee;">
                <div style="background:#1976d2;padding:20px 24px 12px 24px;border-radius:12px 12px 0 0;color:#fff;text-align:center;">
                    <h2 style="margin:0 0 8px 0;font-size:24px;font-weight:700;">Vinabooking</h2>
                </div>
                <div style="padding:24px 24px 12px 24px;">
                    ${
						accommodation
							? `
                        <div style="margin-bottom:12px;">
                            <div style="font-size:16px;font-weight:600;">${accommodation.name}</div>
                            ${accommodation.address ? `<div style="font-size:13px;color:#666;">${accommodation.address}</div>` : ""}
                        </div>
                    `
							: ""
					}
                    <div style="font-size:15px;margin-bottom:8px;">
                        <strong>Booking ID:</strong> #${id}
                    </div>
                    <div style="font-size:14px;margin-bottom:8px;">
                        <strong>Guest:</strong> ${guest.name} (${guest.email})
                    </div>
                    <div style="font-size:14px;margin-bottom:8px;">
                        <strong>Check-in:</strong> ${formatDate(startDate)} &nbsp; <strong>Check-out:</strong> ${formatDate(endDate)}
                    </div>
                    <div style="font-size:14px;margin-bottom:8px;">
                        <strong>Guests:</strong> ${guestCount}
                    </div>
                    <div style="font-size:14px;margin-bottom:8px;">
                        <strong>Rooms:</strong>
                        <div style="margin-top:4px;">
                            ${roomList}
                        </div>
                    </div>
                    <div style="font-size:15px;font-weight:600;margin:16px 0 0 0;text-align:right;">
                        Total: <span style="color:#1976d2;">${totalPrice.toLocaleString()} VND</span>
                    </div>
                </div>
                <div style="padding:16px 24px 20px 24px;text-align:center;font-size:13px;color:#888;border-radius:0 0 12px 12px;display:block;width:100%;box-sizing:border-box;">
                    <div style="margin:0;padding:0;line-height:1.4;">
                        Thank you for choosing Vinabooking! We look forward to welcoming you.
                    </div>
                    <div style="margin:8px 0 0 0;padding:0;font-size:11px;">
                        &copy; ${new Date().getFullYear()} Vinabooking. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    `;
}
