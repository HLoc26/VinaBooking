/**
 * An accommodation's policy
 * @class Policy
 */
class Policy {
	constructor({ id, checkIn, checkOut, cancellation, prepay }) {
		this.id = id;
		this.checkIn = checkIn;
		this.checkOut = checkOut;
		this.cancellation = cancellation; // Expecting value from ECancelPolicy
		this.prepay = prepay; // Expecting value from EPrepayPolicy
	}

	static fromModel(model) {
		return new Policy({
			id: model.id,
			checkIn: model.checkIn,
			checkOut: model.checkOut,
			cancellation: model.cancellation,
			prepay: model.prepay,
		});
	}

	toPlain() {
		return {
			id: this.id,
			checkIn: this.checkIn,
			checkOut: this.checkOut,
			cancellation: this.cancellation,
			prepay: this.prepay,
		};
	}
}

/**
 * Enum for cancellation policies.
 * @readonly
 * @enum {string}
 */
export const ECancelPolicy = Object.freeze({
	CANCEL_24H: "CANCEL_24H",
	CANCEL_3D: "CANCEL_3D",
	CANCEL_7D: "CANCEL_7D",
	CANCEL_15D: "CANCEL_15D",
	NO_CANCEL: "NO_CANCEL",
});

/**
 * Enum for prepayment policies.
 * @readonly
 * @enum {string}
 */
export const EPrepayPolicy = Object.freeze({
	FULL: "FULL",
	HALF: "HALF",
});

export default Policy;
