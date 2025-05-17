import { Router } from "express";
import bookingController from "../controllers/booking.controller.js";
import authMiddleware from "../middlewares/auth.mdw.js";

const bookingRouter = Router();

bookingRouter.post("/", bookingController.bookRoom);
bookingRouter.get("/", authMiddleware.decodeJwt, bookingController.viewBookings);
bookingRouter.put("/:id/cancel", authMiddleware.decodeJwt, bookingController.cancelBooking);

export default bookingRouter;
