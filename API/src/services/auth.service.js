import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../database/dao/UserDAO.js";

export async function loginService(email, password) {
    const user = await findUserByEmail(email);
    if (!user) {
        return { success: false, error: { code: 401, message: "Invalid email or password" } };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { success: false, error: { code: 401, message: "Invalid email or password" } };
    }
    const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: process.env.JWT_EXPIRES || "1d" });
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