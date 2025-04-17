import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../database/models/index.js";

const authService = {
    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return { success: false, error: { code: 401, message: "Invalid email or password" } };
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, error: { code: 401, message: "Invalid email or password" } };
        }
        
        const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            jwtSecret, 
            { expiresIn: process.env.JWT_EXPIRES || "1d" }
        );
        
        return {
            success: true,
            payload: {
                user: {
                    id: user.id,
                    username: user.name,
                    email: user.email,
                },
                jwt: token,
            },
        };
    }
};

export default authService;