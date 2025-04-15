import { Router } from "express";
import { User } from "../database/models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.use("/auth", authRouter);

export default router;