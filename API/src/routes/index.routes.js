import { Router } from "express";
import { User } from "../database/models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authRouter from "./auth.routes.js";

const router = Router();

router.use("/auth", authRouter);

export default router;