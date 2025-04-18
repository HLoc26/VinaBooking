import ReviewService from '../services/review.service.js';
import ImageService from '../services/image.service.js';

class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
    this.imageService = new ImageService();
  }

  async createReview(req, res) {
    const { accommodationId, comment } = req.body;
    const userId = req.user.id; // Extracted from the JWT

    try {
      // Validate required fields
      if (!accommodationId || !comment) {
        return res.status(400).json({
          success: false,
          error: {
            code: 400,
            message: 'Missing required fields: accommodationId and comment',
          },
        });
      }

      let imageUrl = null;
      // Check if images are provided in the request
      if (req.files && req.files.length > 0) {
        const images = await this.imageService.saveImage(req.files);
        // If images are successfully saved, take the first image URL
        if (images.payload && images.payload.length > 0) {
          imageUrl = images.payload[0]; // Assume taking the first image for simplicity
        }
      }

      // Create the review using the ReviewService
      const review = await this.reviewService.createComment(comment, accommodationId, userId, imageUrl);
      // Return a successful response with the created review
      return res.status(201).json({
        success: true,
        message: 'Review created successfully',
        payload: review,
      });
    } catch (error) {
      // Return an error response if review creation fails  
      return res.status(500).json({
        success: false,
        error: {
          code: 500,
          message: 'Failed to create review',
        },
      });
    }
  }
}

export default ReviewController;