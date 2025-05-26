import { Review } from "../../classes/index.js";
import IAccommodationBuilder from "../builders/IAccommodationBuilder.js";
import AccommodationResponse from "../../dtos/AccommodationResponse.js";

class AccommodationResponseBuilder extends IAccommodationBuilder {
	constructor(accommodation) {
		super();
		this.accommodation = accommodation;
		this.data = {
			id: accommodation.id,
			name: accommodation.name,
		};
	}

	withAddress() {
		this.data.address = this.accommodation.getLocationString();
		return this;
	}

	withImages() {
		this.data.images = this.accommodation.images.map((img) => img.toPlain());
		return this;
	}

	withRooms(rooms, bookedCounts = {}) {
		this.data.rooms = rooms.map((room) => room.toPlain(bookedCounts[room.id] || 0));
		return this;
	}

	withMinPrice() {
		this.data.minPrice = this.accommodation.getMinPrice();
		return this;
	}

	async withRating() {
		this.data.rating = await this.accommodation.getAvgRating();
		return this;
	}

	withAmenities() {
		this.data.amenities = this.accommodation.getSimplifiedAmenities();
		return this;
	}

	withPolicy() {
		this.data.policy = this.accommodation.policy ? this.accommodation.policy.toPlain() : null;
		return this;
	}

	withReviews(reviews) {
		this.data.reviews = reviews.map((review) => Review.fromModel(review).toPlain());
		return this;
	}

	build() {
		return new AccommodationResponse(this.data);
	}
}

export default AccommodationResponseBuilder;
