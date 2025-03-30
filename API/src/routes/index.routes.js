import { Router } from "express";

const router = Router();

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

export default router;
