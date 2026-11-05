import { saveImage } from "../utils/saveImage.js"
import { Sketch, Try } from "../models/Database.js";

export class SketchController {
    static async newSketch(req, res) {
        try {
            const rawImage = req.body.image

            if (!rawImage) {
                return res.status(400).json({ message: 'No image provided.' });
            }

            if (!req.body.word) {
                return res.status(400).json({ message: 'No word provided.' });
            }

            const imagePath = saveImage(rawImage);
            await Sketch.create({
                word: req.body.word,
                image: imagePath,
                UserId: req.id
            });
            res.status(201).json({ message: "Sketch created." });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error creating the sketch." });
        }
    };

    static async getAllSketches(req, res) {
        try {
            const sketches = await Sketch.findAll({
                attributes: { exclude: ['word'] }
            });

            res.status(200).json(sketches);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error retrieving the sketches." });
        }

    };

    static async getSketch(req, res) {
        try {
            const sketch = await Sketch.findByPk(req.params.id, {
                attributes: { exclude: ['word'] }
            });

            (!sketch) ? res.status(404).json({ message: 'No sketch found.' }) : res.status(200).json(sketch);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error retrieving the sketch." });
        }

    }

    static async newTry(req, res) {
        try {
            const sketchId = req.params.id;
            const userId = req.id;
            const [found, sketch] = await Promise.all([
                Try.findOne({ where: { UserId: userId, SketchId: sketchId } }),
                Sketch.findByPk(sketchId, { attributes: ['word'] })
            ]);

            if (!sketch) return res.status(404).json({ message: "Sketch not found." });

            if (!req.body.guess) {
                return res.status(400).json({ message: "Guess not provided." });
            }

            const correct = req.body.guess.toLowerCase() === sketch.word.toLowerCase();

            if (!found) {
                await Try.create({
                    tries_used: 1,
                    solved: correct,
                    UserId: userId,
                    SketchId: sketchId
                });

                return res.status(200).json({ correct, tries_left: 9, word: correct ? sketch.word : null });
            }

            if (found.solved) return res.status(409).json({ message: "Already solved." });
            if (found.tries_used >= 10) return res.status(409).json({ message: "Too many tries.", word: sketch.word });

            await found.update({
                tries_used: found.tries_used + 1,
                solved: correct
            });

            const tries_left = 10 - (found.tries_used + 1);
            return res.status(200).json({ correct, tries_left, word: correct || tries_left === 0 ? sketch.word : null });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error." });
        }
    };
};