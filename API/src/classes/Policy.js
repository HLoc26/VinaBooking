/**
 * An accommodation's policy
 * @class Policy
 */
class Policy {
	constructor(id, checkinTime, checkoutTime, cancellation, prepay) {
		this.id = id;
		this.checkinTime = checkinTime;
		this.checkoutTime = checkoutTime;
		this.cancellation = cancellation; // Expecting value from ECancelPolicy
		this.prepay = prepay; // Expecting value from EPrepayPolicy
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
