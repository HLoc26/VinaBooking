import ReviewDAO from '../dao/review.dao.js';

class ReviewService {
  constructor() {
    this.reviewDAO = new ReviewDAO();
  }

  async createComment(comment, accommodationId, userId, imageUrl) {
    try {
      // Attempt to create the review using the DAO  
      const review = await this.reviewDAO.createOne(comment, accommodationId, userId, imageUrl);
      
      // Return a success response with the created review
      return {
        success: true,
        message: 'Review created successfully',
        payload: review,
      };
    } catch (error) {
      // Return an error response if review creation fails  
      return {
        success: false,
        error: {
          code: 500,
          message: 'Failed to create review',
        },
      };
    }
  }
}

export default ReviewService;