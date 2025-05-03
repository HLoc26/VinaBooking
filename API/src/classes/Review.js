/**
 * @class Review
 */
class Review {
	constructor({ id, star, comment, images, reviewer, accommodation, reviewDate }) {
		this.id = id;
		this.star = star;
		this.comment = comment;
		this.images = images;
		this.reviewer = reviewer;
		this.accommodation = accommodation;
		this.reviewDate = reviewDate;
	}

	static fromModel(model) {
		return new Review({
			id: model.id,
			star: model.star,
			comment: model.comment,
			images: model.images,
			reviewer: model.reviewer,
			accommodation: model.accommodation,
			reviewDate: model.reviewDate,
		});
	}

	getStar() {
		return +this.star;
	}
}

export default Review;
