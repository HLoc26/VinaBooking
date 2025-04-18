import Review from '../database/models/Review.model.js';

class ReviewDAO {
  async createOne(comment, accommodationId, userId, imageUrl) {
    try {
      // Attempt to create a new review in the database  
      const review = await Review.create({
        comment,
        accommodationId,
        userId,
        imageUrl,
      });

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

export default ReviewDAO;