class AccommodationDirector {
	constructor(builder) {
		this.builder = builder;
	}

	async buildForDetail(rooms, bookedCounts, reviews) {
		await this.builder.withRating();
		return this.builder
			.withAddress() //
			.withImages()
			.withRooms(rooms, bookedCounts)
			.withAmenities()
			.withMinPrice()
			.withPolicy()
			.withReviews(reviews)
			.build();
	}

	async buildForSearch() {
		await this.builder.withRating();
		return this.builder
			.withAddress() //
			.withImages()
			.withAmenities()
			.withMinPrice()
			.build();
	}

	async buildForPopular() {
		await this.builder.withRating();
		return this.builder
			.withAddress() //
			.withImages()
			.withAmenities()
			.withMinPrice()
			.build();
	}
}

export default AccommodationDirector;
