import express from "express";
import { LeaderboardController } from "../controllers/LeaderboardController.js";

export const leaderboardRouter = express.Router();

leaderboardRouter.get('/leaderboard/best_guessers', (req, res) => {
    LeaderboardController.bestGuessers(req, res);
})

leaderboardRouter.get('/leaderboard/best_drawers', (req, res) => {
    LeaderboardController.bestDrawers(req, res);
})