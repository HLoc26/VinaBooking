import { Router } from "express";
import { User } from "../database/models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// NQ: Check authentication
router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
        const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: process.env.JWT_EXPIRES || "1d" });
        return res.json({
            success: true,
			message: "Login successful",
            payload: {
                user: {
                    id: user.id,
                    username: user.name,
                    email: user.email,
                },
                jwt: token,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;