import { Router } from "express";
import bookingController from "../controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.post("/", bookingController.bookRoom);

export default bookingRouter;
