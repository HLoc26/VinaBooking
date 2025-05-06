import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.get("/", (req, res) => {
	res.json({ success: true, message: "Hello, welcome to auth" });
});

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.initiateRegistration);
authRouter.post("/register/complete", authController.completeRegistration);
export default authRouter;
