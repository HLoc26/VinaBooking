/**
 * A `RegisteredUser`'s favourite list
 * @class FavouriteList
 */
class FavouriteList {
	constructor({ id, userId, accommodations = [] }) {
		this.id = id;
		this.userId = userId;
		this.accommodations = accommodations;
	}

	hasAccommodation(accommodation) {
		return this.accommodations.find((a) => a.id === accommodation.id);
	}

	addAccommodation(accommodation) {
		if (this.accommodations.find((a) => a.id === accommodation.id)) {
			throw new Error("Accommodation already in favourites");
		}
		this.accommodations.push(accommodation);
	}

	removeAccommodation(accommodation) {
		this.accommodations = this.accommodations.filter((a) => a.id !== accommodation.id);
	}
}

export default FavouriteList;
