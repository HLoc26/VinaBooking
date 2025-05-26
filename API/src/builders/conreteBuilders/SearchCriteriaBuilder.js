import SearchCriteria from "../../dtos/SearchCriteria.js";

class SearchCriteriaBuilder {
	constructor() {
		this.criteria = {
			location: {},
			dateRange: {},
			occupancy: {},
			price: {},
		};
	}

	withLocation({ city, state, postalCode, country }) {
		this.criteria.location.city = city;
		this.criteria.location.state = state;
		this.criteria.location.postalCode = postalCode;
		this.criteria.location.country = country;
		return this;
	}

	withDateRange(startDate, endDate) {
		if (startDate) this.criteria.dateRange.startDate = new Date(startDate).toISOString();
		if (endDate) this.criteria.dateRange.endDate = new Date(endDate).toISOString();
		return this;
	}

	withOccupancy(roomCount, adultCount) {
		this.criteria.occupancy.roomCount = parseInt(roomCount, 10) || 1;
		this.criteria.occupancy.adultCount = parseInt(adultCount, 10) || 1;
		return this;
	}

	withPriceRange(priceMin, priceMax) {
		this.criteria.price.priceMin = parseFloat(priceMin || 0);
		this.criteria.price.priceMax = parseFloat(priceMax || Infinity);
		return this;
	}

	// Not yet implemented
	withPromotionCode(promotionCode) {
		return this;
	}

	build() {
		return new SearchCriteria({
			...this.criteria,
		});
	}
}

export default SearchCriteriaBuilder;
