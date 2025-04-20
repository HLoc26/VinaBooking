import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.get("/", (req, res) => {
	res.json({ success: true, message: "Hello, welcome to auth" });
});

authRouter.post("/login", authController.login);
authRouter.post("/otp/request", authController.requestOTP);
authRouter.post("/otp/confirm", authController.confirmOTP);
authRouter.post("/mail/test", authController.testMail); // Mail test route, only dev env
authRouter.post("/register/request", authController.requestRegistration);
authRouter.post("/register/confirm", authController.confirmRegistration);
export default authRouter;
