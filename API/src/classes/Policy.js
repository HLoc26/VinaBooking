/**
 * An accommodation's policy
 * @class Policy
 */
class Policy {
	static ECancelPolicy = Object.freeze({
		CANCEL_24H: "CANCEL_24H",
		CANCEL_3D: "CANCEL_3D",
		CANCEL_7D: "CANCEL_7D",
		CANCEL_15D: "CANCEL_15D",
		NO_CANCEL: "NO_CANCEL",
	});

	static EPrepayPolicy = Object.freeze({
		FULL: "FULL",
		HALF: "HALF",
	});

	constructor(id, checkinTime, checkoutTime, cancellation, prepay) {
		this.id = id;
		this.checkinTime = checkinTime;
		this.checkoutTime = checkoutTime;
		this.cancellation = cancellation; // Using Enum ECancelPolicy
		this.prepay = prepay; // Using Enum EPrepayPolicy
	}
}

export default Policy;
