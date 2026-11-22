import { database } from "../models/Database.js";
import { QueryTypes } from "sequelize";

export class LeaderboardController {
    static async bestGuessers(req, res) {
        try {
            const results = await database.query(
                `SELECT u.username, COUNT(*) as wins
             FROM Users as u
             INNER JOIN Tries as t ON u.id = t.UserId
             WHERE t.solved = true
             GROUP BY u.id
             ORDER BY wins DESC
             LIMIT 10`,
                { type: QueryTypes.SELECT }
            );

            res.status(200).json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error retrieving the leaderboard." });
        }
    }

    static async bestDrawers(req, res) {
        try {
            const results = await database.query(
                `SELECT u.username, ROUND(100.0 * SUM(t.solved) / COUNT(*)) AS points
                FROM Users AS u
                INNER JOIN Sketches AS s ON s.UserId = u.id
                INNER JOIN Tries AS t ON t.SketchId = s.id
                WHERE t.solved = true OR t.tries_used >= 10
                GROUP BY u.id
                HAVING COUNT(*) >= 3
                ORDER BY points DESC, SUM(t.solved) DESC
                LIMIT 10`,
                { type: QueryTypes.SELECT }
            );

            res.status(200).json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error retrieving the leaderboard." });
        }
    }
}