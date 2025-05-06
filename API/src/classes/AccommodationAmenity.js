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
	 * @param {number} accommodationId
	 * @param {EAccommodationAmenityType} type
	 */
	constructor({ id, name, accommodationId, type }) {
		super(id, name);
		this.accommodationId = accommodationId;
		this.type = type;
	}

	static fromModel(model) {
		return new AccommodationAmenity({
			id: model.id,
			name: model.Amenity?.name || model.name,
			accommodationId: model.accommodationId,
			type: model.type,
		});
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
