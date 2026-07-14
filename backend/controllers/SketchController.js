import { saveImage } from "../utils/saveImage.js"
import { Sketch, Try, User } from "../models/Database.js";

export class SketchController {
    static async newSketch(req, res) {
        const rawImage = req.body.image

        if (!rawImage) {
            return Promise.reject(new Error("No image provided"));
        }

        const imagePath = saveImage(rawImage);
        const sketch = await Sketch.create({
            word: req.body.word,
            image: imagePath,
            UserId: req.id
        });
        return sketch;
    };

    static async getAllSketches(req, res) {
        const sketches = await Sketch.findAll();

        return sketches;
    };

    static async getSketch(req, res) {
        const sketch = await Sketch.findByPk(req.params.id);

        return sketch;
    };

    static async newTry(req, res) {
        const sketchId = req.params.id;
        const userId = req.id;
        const [found, sketch] = await Promise.all([
            Try.findOne({ where: { UserId: userId, SketchId: sketchId } }),
            Sketch.findByPk(sketchId, { attributes: ['word'] })
        ]);

        if (!sketch) return Promise.reject(new Error("Sketch not found."));

        const correct = req.body.guess.toLowerCase() === sketch.word.toLowerCase();

        if (!found) {
            return Try.create({
                tries_used: 1,
                solved: correct,
                UserId: userId,
                SketchId: sketchId
            });
        }

        if (found.solved) return Promise.reject(new Error("Already solved."));
        if (found.tries_used >= 10) return Promise.reject(new Error("Too many tries."));

        return found.update({
            tries_used: found.tries_used + 1,
            solved: correct
        });
    };
};