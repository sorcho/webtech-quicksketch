import { database } from "../models/Database.js";
import { QueryTypes } from "sequelize";

export class LeaderboardController {
    static async bestGuessers(req, res) {
        const results = await database.query(
            `SELECT u.username, COUNT(*) as wins
             FROM Users as u
             INNER JOIN Tries as t ON u.id = t.UserId
             WHERE t.solved = true
             GROUP BY u.id
             ORDER BY wins DESC`,
            { type: QueryTypes.SELECT }
        );

        (results.length === 0) ? res.status(200).json({ message: 'No users found.' }) : res.status(200).json(results);
    }

    static async bestDrawers(req, res) {
        const results = await database.query(
            `SELECT u.username, COUNT(*) as points
            FROM Users as u
            INNER JOIN Sketches as s ON s.UserId = u.id
            INNER JOIN Tries as t ON t.SketchId = s.id
            WHERE t.solved = true
            GROUP BY u.id
            ORDER BY points DESC`,
            { type: QueryTypes.SELECT }
        );

        (results.length === 0) ? res.status(200).json({ message: 'No users found.' }) : res.status(200).json(results);
    }
}