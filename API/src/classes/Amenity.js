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
}

export default Amenity;
