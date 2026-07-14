import { Sketch, Try, User } from "../models/Database.js";

export class ProfileController {
    static async getStats(req, res) {
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
        const unsolved = gamesPlayed - solved;

        const nTries = tries.reduce(
            (acc, current) => acc + current.tries_used, 0
        );

        const winRate = gamesPlayed === 0 ? 0 : Math.round((solved / gamesPlayed) * 100);

        return res.status(200).json({ username: found.username, n_sketches: nSketches, n_tries: nTries, n_solved: solved, n_unsolved: unsolved, games_played: gamesPlayed, win_rate: winRate })
    }
}