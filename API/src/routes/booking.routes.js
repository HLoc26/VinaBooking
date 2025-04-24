import { Router } from 'express';
import bookingController from '../controllers/booking.controller.js';
import authenticate from '../middleware/authenticate.js';

const bookingRouter = Router();

bookingRouter.put('/:bookingId/cancel', authenticate, bookingController.cancelBooking);

export default bookingRouter;