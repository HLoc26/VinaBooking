class BookingRequestBuilder {
	constructor() {
		this.data = {};
	}

	withGuestId(guestId) {
		if (guestId) {
			this.data.guestId = parseInt(guestId, 10);
			return this;
		}
		throw new Error("Invalid user");
	}

	withDateRange(startDate, endDate) {
		if (startDate) this.data.startDate = new Date(startDate).toISOString();
		if (endDate) this.data.endDate = new Date(endDate).toISOString();
		return this;
	}

	withRooms(rooms) {
		// In case the FE send a string with object format, parse it
		if (typeof rooms === "string") {
			rooms = JSON.parse(rooms);
		}

		if (!rooms || typeof rooms !== "object" || Array.isArray(rooms)) {
			throw new Error("Rooms must be an object with roomId => quantity format.");
		}

		// Validate all quantities are integers >= 1
		for (const [roomId, quantity] of Object.entries(rooms)) {
			const parsedQty = parseInt(quantity, 10);
			if (isNaN(parsedQty) || parsedQty < 1) {
				throw new Error(`Invalid quantity for room ${roomId}: ${quantity}`);
			}
			rooms[roomId] = parsedQty;
		}

		this.data.rooms = rooms;
		return this;
	}

	withGuestCount(guestCount) {
		this.data.guestCount = parseInt(guestCount, 10) || 1;
		return this;
	}

	build() {
		if (!this.data.guestId) throw new Error("Guest ID is required.");
		if (!this.data.startDate || !this.data.endDate) throw new Error("Date range is required.");
		if (!this.data.rooms || this.data.rooms.length === 0) throw new Error("At least one room must be selected.");
		return this.data;
	}
}

export default BookingRequestBuilder;
