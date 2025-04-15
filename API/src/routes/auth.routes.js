// routes/auth.routes.js
import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";

const authRouter = Router();

// Test route
authRouter.get("/", (req, res) => {
	res.json({ success: true, message: "Hello, welcome from auth" });
});

// OTP routes
authRouter.post("/otp/request", AuthController.requestOTP);
authRouter.post("/otp/confirm", AuthController.confirmOTP);

export default authRouter;
