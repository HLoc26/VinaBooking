import Image from './Image.js';
import User from './User.js';

/**
 * @class Review
 */
class Review {
	constructor({ id, star, comment, images, reviewer, accommodation, reviewDate }) {
		this.id = id;
		this.star = star;
		this.comment = comment;
		this.images = images ? images.map((i) => new Image(i)) : [];
		this.reviewer = reviewer ? new User(reviewer) : null;
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

	toPlain() {
		return {
			id: this.id,
			star: this.star,
			comment: this.comment,
			images: this.images.map((i) => i.toPlain()),
			reviewer: this.reviewer ? this.reviewer.toPlain() : null,
			reviewDate: this.reviewDate,
		};
	}
}

export default Review;
