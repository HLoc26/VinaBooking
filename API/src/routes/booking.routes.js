import { Router } from "express";
import bookingController from "../controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.get("/", bookingController.getBookingList);

export default bookingRouter;
