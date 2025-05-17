import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.mdw.js";

const authRouter = Router();

authRouter.get("/", (req, res) => {
	res.json({ success: true, message: "Hello, welcome to auth" });
});

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.initiateRegistration);
authRouter.post("/register/complete", authController.completeRegistration);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authMiddleware.decodeJwt, authController.getCurrentUser);

export default authRouter;
