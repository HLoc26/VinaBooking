import { Router } from "express";
import authRouter from "./auth.routes.js";

const router = Router();

router.get("/", (req, res) => {
	res.json({ success: true, message: "Hello, welcome" });
});

router.use("/auth", authRouter);

export default router;