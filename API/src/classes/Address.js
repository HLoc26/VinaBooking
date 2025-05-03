/**
 * An `Accommodation`'s address.
 * @class Address
 */
class Address {
	constructor({ id, street, city, state, postalCode, country, latitude, longitude }) {
		this.id = id;
		this.street = street;
		this.city = city;
		this.state = state;
		this.postalCode = postalCode;
		this.country = country;
		this.latitude = latitude;
		this.longitude = longitude;
	}

	static fromModel(model) {
		return new Address({
			id: model.id,
			street: model.street,
			city: model.city,
			state: model.state,
			postalCode: model.postalCode,
			country: model.country,
			latitude: model.latitude,
			longitude: model.longitude,
		});
	}

	getCoordinates() {
		return [this.latitude, this.longitude];
	}

	getLocationString() {
		return `${this.city}, ${this.state}, ${this.country}`;
	}
}

export default Address;
