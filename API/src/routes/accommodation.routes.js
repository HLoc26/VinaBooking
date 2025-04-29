import { Router } from "express";
import accommodationController from "../controllers/accommodation.controller.js";
import searchMiddleware from "../middlewares/search.mdw.js";

const accommodationRouter = Router();

// This route should be defined before /:id
accommodationRouter.get("/search", searchMiddleware.validateSearch, accommodationController.search);
accommodationRouter.get("/:id", accommodationController.getAccommodationDetail);

export default accommodationRouter;