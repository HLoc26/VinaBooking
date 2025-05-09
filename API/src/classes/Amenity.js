/**
 * Base amenity class. Have 2 children: `AccommodationAmenity` and `RoomAmenity`
 * @class Amenity
 * @abstract
 */
class Amenity {
	/**
	 * @param {number} id
	 * @param {string} name
	 */
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}

	static fromModel(model) {
		return new Amenity({
			id: model.id,
			name: model.name,
		});
	}

	toPlain() {
		return {
			id: this.id,
			name: this.name,
		};
	}

	toString() {
		return this.name;
	}
}

export default Amenity;
