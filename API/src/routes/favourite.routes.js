import { Router } from "express";
import favouriteController from "../controllers/favourite.controller.js";


const favouriteRouter = Router();

// Add or remove a favourite accommodation for favourite list of a user
favouriteRouter.post("/add", favouriteController.addToFavourite);
favouriteRouter.delete("/remove/:accommodationId", favouriteController.removeFromFavourite);

export default favouriteRouter;
