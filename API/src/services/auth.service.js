import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
  
import redis from "../config/redis.js";
import { User } from "../database/models/index.js";

export default {
  // Authenticates a user and generates a JWT token
  async login(email, password) {
      try {
          const user = await User.findOne({ where: { email } });
          if (!user) {
              return { success: false, error: { code: 401, message: "Invalid email or password" } };
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return { success: false, error: { code: 401, message: "Invalid email or password" } };
          }

          const token = this.generateToken(user);

          return {
              success: true,
              payload: {
                  user: this.sanitizeUser(user),
                  jwt: token,
              }
          };
      } catch (error) {
          return {
              success: false,
              error: { code: 500, message: "Authentication failed", details: error.message }
          };
      }
  },

  //Generates JWT token for a user
  generateToken(user) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) throw new Error("Missing JWT_SECRET in environment variables"); // Throw error if env not set
      return jwt.sign(
          { id: user.id, email: user.email }, 
          jwtSecret, 
          { expiresIn: process.env.JWT_EXPIRES || "1d" }
      );
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
              error: { code: 401, message: "Invalid token", details: error.message } 
          };
      }
  },
  
	async generateOTP(identifier) {
		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		await redis.setex(`otp:${identifier}`, 300, otp);
		return otp;
	},

	async validateOTP(identifier, submittedOtp) {
		const key = `otp:${identifier}`;
		const storedOtp = await redis.get(key);

		if (!storedOtp) return { valid: false, message: "OTP expired or not found" };
		if (storedOtp !== submittedOtp) return { valid: false, message: "Incorrect OTP" };

		await redis.del(key);
		return { valid: true, message: "OTP verified successfully" };
	},
};
