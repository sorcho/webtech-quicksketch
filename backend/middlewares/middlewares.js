import { AuthController } from "../controllers/AuthController.js";
import { Sketch } from "../models/Database.js";

export function requireAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "User not authenticated" });

    AuthController.checkToken(token, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token invalid or tampered." });
        req.id = decoded.id;
        next();
    })
}

export async function userCantGuessOwnSketch(req, res, next) {
    try {
        const sketchId = req.params.id;
        const userId = req.id;
        const sketchOwner = await Sketch.findByPk(sketchId, { attributes: ['UserId'] })

        if (sketchOwner?.UserId === userId) {
            return res.status(403).json({ message: "Can't guess own sketch." });
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error." });
    }

}
