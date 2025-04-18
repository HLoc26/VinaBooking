import { Router } from "express";
import bookingRouter from './booking.routes.js';

const router = Router();

router.get("/", (req, res) => {
    res.json({ success: true, message: "Hello, welcome" });
});

// Testing
router.post("/auth/login", (req, res) => {
	const { email, password } = req.body;
	// Mock data
	if (email == "hello@gmail.com" && password == "itsme") {
		res.json({
			success: true,
			payload: {
				user: {
					username: "UserTest",
					email: "hello@gmail.com",
				},
				jwt: "abcxyz123",
			},
		});
	} else {
		res.json({
			success: false,
			message: "Wrong username or password",
		});
	}
});

router.use('/booking', bookingRouter);

export default router;
