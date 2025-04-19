import { Router } from "express";
import accommodationRouter from "./accommodation.routes.js";
import authRouter from "./auth.routes.js";

const router = Router();

router.get("/", (req, res) => {
	res.json({ success: true, message: "Hello, welcome" });
});

router.use("/accommodation", accommodationRouter);

router.use("/auth", authRouter);

export default router;