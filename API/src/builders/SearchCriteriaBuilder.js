import SearchCriteria from "../dtos/SearchCriteria.js";

class SearchCriteriaBuilder {
	constructor() {
		this.criteria = {};
	}

	withLocation({ city, state, postalCode, country }) {
		this.criteria.city = city;
		this.criteria.state = state;
		this.criteria.postalCode = postalCode;
		this.criteria.country = country;
		return this;
	}

	withDateRange(startDate, endDate) {
		if (startDate) this.criteria.startDate = new Date(startDate).toISOString();
		if (endDate) this.criteria.endDate = new Date(endDate).toISOString();
		return this;
	}

	withOccupancy(roomCount, adultCount) {
		this.criteria.roomCount = parseInt(roomCount, 10) || 1;
		this.criteria.adultCount = parseInt(adultCount, 10) || 1;
		return this;
	}
	withPriceRange(priceMin, priceMax) {
		this.criteria.priceMin = parseFloat(priceMin || 0);
		this.criteria.priceMax = parseFloat(priceMax || Infinity);
		return this;
	}

	withPromotionCode(promotionCode) {
		return this;
	}

	build() {
		return new SearchCriteria({
			location: {
				city: this.criteria.city,
				state: this.criteria.state,
				postalCode: this.criteria.postalCode,
				country: this.criteria.country,
			},
			dateRange: {
				startDate: this.criteria.startDate,
				endDate: this.criteria.endDate,
			},
			occupancy: {
				roomCount: this.criteria.roomCount,
				adultCount: this.criteria.adultCount,
			},
			price: {
				priceMin: this.criteria.priceMin,
				priceMax: this.criteria.priceMax,
			},
		});
	}
}

export default SearchCriteriaBuilder;
