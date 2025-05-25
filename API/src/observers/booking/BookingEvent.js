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

export { BookingEvent };
