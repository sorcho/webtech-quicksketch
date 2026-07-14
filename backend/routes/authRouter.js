import express from "express";
import { AuthController } from "../controllers/AuthController.js";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    let user = await AuthController.checkCreds(req, res);

    if(!user) {
        res.status(400).json({message: "Invalid credentials"});
    }

    const token = AuthController.issueToken(user.id);
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).send();

});

authRouter.post("/signup", async (req, res, next) => {
    AuthController.newUser(req, res).then(() => {
        res.status(201).send();
    }).catch((err) => {
        res.status(400).json({ error_message: err.errors[0].message, error_type: err.errors[0].type });
    });
})