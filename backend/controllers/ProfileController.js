import { Sketch, Try, User } from "../models/Database.js";

export class ProfileController {
    static async getStats(req, res) {
        try {
            const userId = req.id;
            const found = await User.findByPk(userId, {
                attributes: ['username']
            });

            if (!found) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const nSketches = await Sketch.count({ where: { UserId: userId } });
            const tries = await Try.findAll({ where: { UserId: userId } });

            const gamesPlayed = tries.length;

            const solved = tries.filter(t => t.solved).length;
            const failed = tries.filter(t => !t.solved && t.tries_used >= 10).length;
            const playing = gamesPlayed - solved - failed;

            const nTries = tries.reduce(
                (acc, current) => acc + current.tries_used, 0
            );

            const finished = solved + failed;
            const winRate = finished === 0 ? 0 : Math.round((solved / finished) * 100);

            return res.status(200).json({
                username: found.username,
                n_sketches: nSketches,
                n_tries: nTries,
                n_solved: solved,
                n_failed: failed,
                n_playing: playing,
                games_played: gamesPlayed,
                win_rate: winRate
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error retrieving the profile." });
        }
    }
}