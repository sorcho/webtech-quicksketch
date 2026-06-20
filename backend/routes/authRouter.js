import express from "express";
import { AuthController } from "../controllers/AuthController.js";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    let isAuthenticated = await AuthController.checkCreds(req, res);

    if (isAuthenticated) {
        const token = AuthController.issueToken(req.body.username);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24*60*60*1000
        })
        res.status(200).send();
    } else {
        res.status(400).send();
    }
});

authRouter.post("/signup", async (req, res, next) => {
    AuthController.newUser(req, res).then(() => {
        res.status(201).send();
    }).catch((err) => {
        res.status(400).json({error_message: err.errors[0].message, error_type: err.errors[0].type});
    });
})