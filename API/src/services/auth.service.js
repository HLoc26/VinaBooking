import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../classes/User.js";
import redis from "../config/redis.js";
import { User as UserModel } from "../database/models/index.js";
import emailService from "./email.service.js";

export default {
	// Authenticates a user and generates a JWT token
	async login(email, password, rememberMe = false) {
		try {
			const user = await UserModel.findOne({ where: { email } });
			if (!user) {
				return { success: false, error: { code: 401, message: "Invalid email or password" } };
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return { success: false, error: { code: 401, message: "Invalid email or password" } };
			}

			const token = this.generateToken(user, rememberMe);

			return {
				success: true,
				payload: {
					user: this.sanitizeUser(user),
					jwt: token,
					rememberMe,
				},
			};
		} catch (error) {
			return {
				success: false,
				error: { code: 500, message: "Authentication failed", details: error.message },
			};
		}
	},

	//Generates JWT token for a user
	generateToken(user, rememberMe = false) {
		const jwtSecret = process.env.JWT_SECRET;
		if (!jwtSecret) throw new Error("Missing JWT_SECRET in environment variables"); // Throw error if env not set

		// Set longer expiration for "Remember Me"
		const expiresIn = rememberMe ? process.env.JWT_REMEMBER_EXPIRES || "30d" : process.env.JWT_EXPIRES || "1d";

		return jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn });
	},

	// Returns user data without sensitive information
	sanitizeUser(user) {
		return {
			id: user.id,
			username: user.name,
			email: user.email,
		};
	},

	//Verifies if a token is valid
	verifyToken(token) {
		try {
			const jwtSecret = process.env.JWT_SECRET;
			if (!jwtSecret) throw new Error("Missing JWT_SECRET in environment variables"); // Throw error if env not set
			const decoded = jwt.verify(token, jwtSecret);
			return { success: true, payload: decoded };
		} catch (error) {
			return {
				success: false,
				error: { code: 401, message: "Invalid token", details: error.message },
			};
		}
	},

	async generateOTP(identifier) {
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		await redis.setex(`otp:${identifier}`, 300, otp);
		await redis.setex(`otp_attempts:${identifier}`, 600, 0);
		return otp;
	},

	async validateOTP(identifier, submittedOtp) {
		const otpKey = `otp:${identifier}`;
		const attemptsKey = `otp_attempts:${identifier}`;

		const storedOtp = await redis.get(otpKey);
		if (!storedOtp) return { valid: false, message: "OTP expired or not found" };

		// Get current attempt count (default to 0)
		let attempts = parseInt(await redis.get(attemptsKey)) || 0;

		// Too many attempts
		if (attempts >= 5) {
			await redis.del(otpKey); // Optional: delete OTP when locked
			await redis.del(attemptsKey);
			return { valid: false, message: "Too many incorrect attempts. OTP has been invalidated." };
		}

		// Check OTP match
		if (storedOtp !== submittedOtp) {
			await redis.set(attemptsKey, attempts + 1, "EX", 600); // reset expiry too
			return { valid: false, message: `Incorrect OTP. Attempts remaining: ${4 - attempts}` };
		}

		// Success - delete OTP and attempts key
		await redis.del(otpKey);
		await redis.del(attemptsKey);

		return { valid: true, message: "OTP verified successfully" };
	},

	async initiateRegistration(userData) {
		const existingUser = await User.findByEmail(userData.email); // Use User class method
		if (existingUser) {
			return { success: false, error: { code: 409, message: "Email already exists." } };
		}

		await redis.setex(`pending_user:${userData.email}`, 300, JSON.stringify(userData));

		const otp = await this.generateOTP(userData.email);
		await emailService.sendOTP(userData.email, otp);

		return { success: true };
	},

	async completeRegistration(email, otp) {
		const validOtp = await this.validateOTP(email, otp);
		if (!validOtp.valid) {
			return { success: false, error: { code: 400, message: validOtp.message } };
		}

		const userDataStr = await redis.get(`pending_user:${email}`);
		if (!userDataStr) {
			return { success: false, error: { code: 410, message: "Registration expired." } };
		}

		const userData = JSON.parse(userDataStr);
		userData.password = await bcrypt.hash(userData.password, 10);

		// Now create User instance
		const usr = new User(userData);
		await usr.save();

		await redis.del(`pending_user:${email}`);

		return { success: true };
	},

	// Get user by ID
	async getUserById(userId) {
		try {
			const user = await UserModel.findByPk(userId);
			return user;
		} catch (error) {
			console.error("Error fetching user by ID:", error);
			return null;
		}
	}
};
