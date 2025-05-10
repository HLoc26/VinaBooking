import Amenity from "./Amenity.js";

/**
 * An accommodation's single amenity. Accommodation will contain a list of this class.
 * @class AccommodationAmenity
 * @extends {Amenity}
 */
class AccommodationAmenity extends Amenity {
	/**
	 * @param {number} id
	 * @param {string} name
	 * @param {EAccommodationAmenityType} type
	 */
	constructor({ id, name, type }) {
		super({ id, name });
		this.id = Number(id); // Ensure id is a number
		this.type = type;
	}

	static fromModel(model) {
		const amenityData = {
			id: Number(model.Amenity?.id || model.id),
			name: model.Amenity?.name || model.name || "Unknown Amenity",
			type: model.type || "general",
		};
		return new AccommodationAmenity(amenityData);
	}

	toPlain() {
		return {
			id: Number(this.id),
			name: this.name || "Unknown Amenity",
			type: this.type,
		};
	}

	toString() {
		return this.name;
	}
}

/**
 * Enum for accommodation amenity types.
 * @readonly
 * @enum {string}
 */
export const EAccommodationAmenityType = Object.freeze({
	GENERAL: "general",
	FOOD_DRINK: "food_drink",
	PUBLIC_FACILITY: "public_facility",
});

export default AccommodationAmenity;
