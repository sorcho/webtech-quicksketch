import express from "express";
import { requireAuth } from "../middlewares/middlewares.js";
import { ProfileController } from "../controllers/ProfileController.js";

export const profileRouter = express.Router();

profileRouter.get("/profile", requireAuth, (req, res) => {
    ProfileController.getStats(req, res);
})