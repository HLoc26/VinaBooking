import { Router } from 'express';
import reviewController from '../controllers/review.controller.js';
import authenticate from '../middleware/authenticate.js';

const reviewRouter = Router();

// Route for creating a review
reviewRouter.post('/', authenticate, reviewController.createReview);

export default reviewRouter;