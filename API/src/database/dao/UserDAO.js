import { User } from "../models/index.js";

export async function findUserByEmail(email) {
    return User.findOne({ where: { email } });
}