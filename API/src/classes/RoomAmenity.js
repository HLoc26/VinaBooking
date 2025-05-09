import Amenity from "./Amenity.js";

/**
 * A room's single amenity. Room will contain a list of this class.
 * @class RoomAmenity
 * @extends {Amenity}
 */
class RoomAmenity extends Amenity {
	/**
	 * @param {number} id
	 * @param {string} name
	 * @param {number} roomId
	 * @param {ERoomAmenityType} type
	 */
	constructor(id, name, type) {
		super(id, name);
		this.id = Number(id); // Ensure id is a number
		this.type = type;
	}

	toPlain() {
		return {
			id: Number(this.id),
			name: this.name || "Unknown Amenity",
			type: this.type,
		};
	}
}

/**
 * Enum for room amenity types.
 * @readonly
 * @enum {string}
 */
export const ERoomAmenityType = Object.freeze({
	BASE: "base",
	BATHROOM: "bathroom",
	FACILITY: "facility",
});

export default RoomAmenity;
