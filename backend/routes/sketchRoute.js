import express from "express";
import { SketchController } from "../controllers/SketchController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { userCantGuessOwnSketch } from "../middlewares/requireAuth.js";

export const sketchRouter = express.Router();

sketchRouter.post("/sketches", requireAuth, async (req, res) => {
    SketchController.newSketch(req, res).then(() => {
        return res.status(200).json({ message: "Sketch created." });
    }).catch(err => {
        res.status(401).json({ error: err.message });
    });
});

sketchRouter.post("/sketches/:id/tries", requireAuth, userCantGuessOwnSketch, async (req, res) => {

});

sketchRouter.get("/sketches", (req, res) => {
    SketchController.getAllSketches(req, res).then(sketches => {
        res.json(sketches);
    });
});

sketchRouter.get("/sketches/:id", (req, res) => {
    SketchController.getSketch(req, res).then(sketch => {
        res.json(sketch);
    });
});