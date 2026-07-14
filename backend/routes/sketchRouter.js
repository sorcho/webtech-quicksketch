import express from "express";
import { SketchController } from "../controllers/SketchController.js";
import { requireAuth, userCantGuessOwnSketch } from "../middlewares/middlewares.js";

export const sketchRouter = express.Router();

sketchRouter.post("/sketches", requireAuth, (req, res) => {
    SketchController.newSketch(req, res);
});

sketchRouter.post("/sketches/:id/tries", requireAuth, userCantGuessOwnSketch, (req, res) => {
    SketchController.newTry(req, res);
});

sketchRouter.get("/sketches", (req, res) => {
    SketchController.getAllSketches(req, res)
});

sketchRouter.get("/sketches/:id", (req, res) => {
    SketchController.getSketch(req, res);
});