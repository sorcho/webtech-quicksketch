import express from "express";
import { AuthController } from "../controllers/AuthController.js";

export const authRouter = express.Router();

authRouter.post("/login", (req, res) => {
    AuthController.checkCreds(req, res);
});

authRouter.post("/signup", (req, res, next) => {
    AuthController.newUser(req, res)
})