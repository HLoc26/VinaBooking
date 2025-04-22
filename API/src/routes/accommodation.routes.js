import { Router } from "express";
import accommodationController from "../controllers/accommodation.controller.js";

const accommodationRouter = Router();

// This route should be defined before /:id
accommodationRouter.get("/search", accommodationController.search);
accommodationRouter.get("/:id", accommodationController.getAccommodationDetail);

export default accommodationRouter;
