import { saveImage } from "../utils/saveImage.js"
import { Sketch, Try } from "../models/Database.js";

export class SketchController {
    static async newSketch(req, res) {
        const rawImage = req.body.image

        if (!rawImage) {
            return res.status(400).json({ message: 'No image provided.' });
        }

        if (!req.body.word) {
            return res.status(400).json({ message: 'No word provided.' });
        }

        try {
            const imagePath = saveImage(rawImage);
            await Sketch.create({
                word: req.body.word,
                image: imagePath,
                UserId: req.id
            });
            res.status(201).json({ message: "Sketch created." });
        } catch (err) {
            res.status(500).json({ message: "Error creating the sketch." });
        }
    };

    static async getAllSketches(req, res) {
        const sketches = await Sketch.findAll({
            attributes: { exclude: ['word'] }
        });

        (sketches.length === 0) ? res.status(404).json({ message: 'No sketches found.' }) : res.status(200).json(sketches);
    };

    static async getSketch(req, res) {
        const sketch = await Sketch.findByPk(req.params.id, {
            attributes: { exclude: ['word'] }
        });

        (!sketch) ? res.status(404).json({ message: 'No sketch found.' }) : res.status(200).json(sketch);
    }

    static async newTry(req, res) {
        const sketchId = req.params.id;
        const userId = req.id;

        try {
            const [found, sketch] = await Promise.all([
                Try.findOne({ where: { UserId: userId, SketchId: sketchId } }),
                Sketch.findByPk(sketchId, { attributes: ['word'] })
            ]);

            if (!sketch) return res.status(404).json({ error: "Sketch not found." });

            const correct = req.body.guess.toLowerCase() === sketch.word.toLowerCase();

            if (!found) {
                await Try.create({
                    tries_used: 1,
                    solved: correct,
                    UserId: userId,
                    SketchId: sketchId
                });

                return res.status(200).json({ correct, tries_left: 9 });
            }

            if (found.solved) return res.status(409).json({ error: "Already solved." });
            if (found.tries_used >= 10) return res.status(409).json({ error: "Too many tries.", word: sketch.word });

            await found.update({
                tries_used: found.tries_used + 1,
                solved: correct
            });

            const tries_left = 10 - (found.tries_used + 1);
            return res.status(200).json({ correct, tries_left, word: correct || tries_left === 0 ? sketch.word : null });
        } catch (err) {
            res.status(500).json({ error: "Internal server error." });
        }
    };
};