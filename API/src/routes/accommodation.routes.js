import { Router } from "express";
import accommodationController from "../controllers/accommodation.controller.js";

const accommodationRouter = Router();

accommodationRouter.get("/detail", accommodationController.getAccommodationDetail);

export default accommodationRouter;
