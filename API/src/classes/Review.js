/**
 * @class Review
 */
class Review {
	constructor(id, star, comment, images, reviewer, accommodation, reviewDate) {
		this.id = id;
		this.star = star;
		this.comment = comment;
		this.images = images;
		this.reviewer = reviewer;
		this.accommodation = accommodation;
		this.reviewDate = reviewDate;
	}
}

export default Review;
