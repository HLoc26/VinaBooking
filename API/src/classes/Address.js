/**
 * An `Accommodation`'s address.
 * @class Address
 */
class Address {
	constructor(id, street, city, state, postalCode, country, latitude, longitude) {
		this.id = id;
		this.street = street;
		this.city = city;
		this.state = state;
		this.postalCode = postalCode;
		this.country = country;
		this.latitude = latitude;
		this.longitude = longitude;
	}

	getCoordinates() {
		return [this.latitude, this.longitude];
	}
}

export default Address;
