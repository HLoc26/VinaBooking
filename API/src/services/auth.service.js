import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../database/models/index.js";

const authService = {
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
        const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
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
            const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
            const decoded = jwt.verify(token, jwtSecret);
            return { success: true, payload: decoded };
        } catch (error) {
            return { 
                success: false, 
                error: { code: 401, message: "Invalid token", details: error.message } 
            };
        }
    }
};

export default authService;