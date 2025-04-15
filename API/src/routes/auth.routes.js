// routes/auth.routes.js
import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

// Test route
authRouter.get("/", (req, res) => {
	res.json({ success: true, message: "Hello, welcome from auth" });
});

// OTP routes using object-style controller
authRouter.post("/otp/request", authController.requestOTP);
authRouter.post("/otp/confirm", authController.confirmOTP);

export default authRouter;
