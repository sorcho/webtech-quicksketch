import express from "express";
import rateLimit from "express-rate-limit"
import { AuthController } from "../controllers/AuthController.js";
import { requireAuth } from "../middlewares/middlewares.js";

export const authRouter = express.Router();

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: { message: "Too many tries, try later." }
});

authRouter.post("/login", rateLimiter, (req, res) => {
    AuthController.checkCreds(req, res);
});

authRouter.post("/signup", (req, res, next) => {
    AuthController.newUser(req, res);
})

authRouter.get("/me", requireAuth, (req, res) => {
    res.status(200).json({ id: req.id });
})

authRouter.post("/logout", requireAuth, (req, res) => {
    AuthController.logout(req, res);
})