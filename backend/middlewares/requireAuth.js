import { AuthController } from "../controllers/AuthController.js";
import { Sketch } from "../models/Database.js";

export function requireAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "User not authenticated" });

    AuthController.checkToken(token, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token invalid or tampered." });
        req.id = decoded.id;
        next();
    })
}

export async function userCantGuessOwnSketch(req, res, next) {
    const sketchId = req.params.id;
    const userId = req.id;
    const sketchOwner = await Sketch.findByPk(sketchId, { attributes: ['UserId'] })

    if (sketchOwner == userId) {
        return res.status(400).json({ message: "Can't guess own sketch." });
    }

    next();
}
