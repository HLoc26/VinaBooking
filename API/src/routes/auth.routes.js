// routes/auth.routes.js
import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.get("/", (req, res) => {
	res.json({ success: true, message: "Hello, welcome from auth" });
});

authRouter.post("/otp/request", authController.requestOTP);
authRouter.post("/otp/confirm", authController.confirmOTP);
authRouter.post("/mail/test", authController.testMail); // 💌 New mail test route

export default authRouter;
