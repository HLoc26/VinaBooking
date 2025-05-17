class SearchCriteria {
	constructor({ location, dateRange, occupancy, price }) {
		this.location = location;
		this.dateRange = dateRange;
		this.occupancy = occupancy;
		this.price = price;
	}

	isValid() {
		const { startDate, endDate } = this.dateRange;
		return !!(startDate && endDate);
	}

	getISODate() {
		return {
			startDate: new Date(this.dateRange.startDate).toISOString().split("T")[0],
			endDate: new Date(this.dateRange.endDate).toISOString().split("T")[0],
		};
	}
}

export default SearchCriteria;
