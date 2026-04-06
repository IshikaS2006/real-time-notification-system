import express from "express";
import rateLimit from "express-rate-limit";
import { registerUser, loginUser } from "../controllers/auth.controllers.js";

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 7,
    message: "Too many auth attempts, please try after 15mins"
});

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);

export default router;