import { Router } from "express";

import accommodationRouter from "./accommodation.routes.js";
import authRouter from "./auth.routes.js";
import bookingRouter from './booking.routes.js';
import favouriteRouter from "./favourite.routes.js";
import authMiddleware from "../middlewares/auth.mdw.js";

const router = Router();

router.get("/", (req, res) => {
    res.json({ success: true, message: "Hello, welcome" });
});

router.use("/accommodations", accommodationRouter);

router.use("/auth", authRouter);

router.use('/booking', bookingRouter);

router.use("/favourite", authMiddleware.decodeJwt, favouriteRouter);

export default router;
