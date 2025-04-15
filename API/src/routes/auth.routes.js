import { Router } from "express";

const authRouter = Router();

authRouter.get("/", (req, res) => {
	res.json({ success: true, message: "Hello, welcome from auth" });
});

export default authRouter;
