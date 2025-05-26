class AccommodationResponse {
	constructor({ id, name, address, images, rooms, minPrice, rating, amenities, policy, reviews }) {
		this.id = id;
		this.name = name;
		this.address = address;
		this.images = images;
		this.rooms = rooms;
		this.minPrice = minPrice;
		this.rating = rating;
		this.amenities = amenities;
		this.policy = policy;
		this.reviews = reviews;
	}
}

export default AccommodationResponse;
