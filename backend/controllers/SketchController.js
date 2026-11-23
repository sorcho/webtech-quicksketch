import { saveImage } from "../utils/saveImage.js"
import { Sketch, Try, User } from "../models/Database.js";
import { words } from "../utils/words.js";
import Jwt from "jsonwebtoken";

function getStatus(sketch, userId, userTry) {
    if (sketch.UserId === userId) return 'own';
    if (!userTry) return 'new';
    if (userTry.solved) return 'solved';
    if (userTry.tries_used >= 10) return 'failed';
    return 'playing';
}

export class SketchController {
    static async newSketch(req, res) {
        try {
            const drawingToken = req.body.drawingToken;
            let decodedPayload;

            try {
                decodedPayload = Jwt.verify(drawingToken, process.env.DRAWING_SECRET, { algorithms: ['RS256'] });
            } catch (error) {
                if (error.name === "TokenExpiredError") {
                    return res.status(400).json({ message: 'You took too long drawing!' });
                }

                return res.status(400).json({ message: 'Error submitting the sketch.' });
            }

            const userId = req.id;
            const rawImage = req.body.image;
            const word = decodedPayload.word;

            if (userId !== decodedPayload.id) {
                return res.status(403).json({ message: 'Tampered form.' });
            }

            if (!rawImage) {
                return res.status(400).json({ message: 'No image provided.' });
            }

            const imagePath = saveImage(rawImage);
            await Sketch.create({
                word: word,
                image: imagePath,
                UserId: userId
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
            console.log(req.id)
            if (!req.id) {
                return res.status(200).json(sketches);
            }

            const tries = await Try.findAll({ where: { UserId: req.id } });
            const triesBySketch = new Map(tries.map(t => [t.SketchId, t]));

            const result = sketches.map(sketch => ({
                ...sketch.toJSON(),
                status: getStatus(sketch, req.id, triesBySketch.get(sketch.id))
            }));

            res.status(200).json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error retrieving the sketches." });
        }

    };

    static async getSketch(req, res) {
        try {
            const sketch = await Sketch.findByPk(req.params.id, {
                include: [{ model: User, attributes: ["username"] }],
                attributes: { exclude: ['word', "updatedAt"] }
            });

            (!sketch) ? res.status(404).json({ message: 'No sketch found.' }) : res.status(200).json(sketch);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error retrieving the sketch." });
        }
    };

    static async newTry(req, res) {
        try {
            const sketchId = req.params.id;
            const userId = req.id;
            const [found, sketch] = await Promise.all([
                Try.findOne({ where: { UserId: userId, SketchId: sketchId } }),
                Sketch.findByPk(sketchId, { attributes: ['word'] })
            ]);

            if (!sketch) return res.status(404).json({ message: "Sketch not found." });

            if (!req.body.guess.trim()) {
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

            const tries_left = 10 - found.tries_used;
            return res.status(200).json({ correct, tries_left, word: correct || tries_left === 0 ? sketch.word : null });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error." });
        }
    };

    static async getPlayerStatus(req, res) {
        try {
            const sketchId = req.params.id;
            const userId = req.id;

            const [found, sketch] = await Promise.all([
                Try.findOne({ where: { UserId: userId, SketchId: sketchId } }),
                Sketch.findByPk(sketchId, { attributes: ['word'] })
            ]);

            if (!sketch) return res.status(404).json({ message: "Sketch not found." });

            if (!found) return res.status(200).json({ status: "playing", tries_left: 10, word: null });

            const tries_left = 10 - found.tries_used;

            if (found.solved) return res.status(200).json({ status: "solved", tries_left: tries_left, word: sketch.word });

            if (found.tries_used >= 10) return res.status(200).json({ status: "failed", tries_left: tries_left, word: sketch.word });

            return res.status(200).json({ status: "playing", tries_left: tries_left, word: null });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Internal server error." });
        }
    }

    static getRandomWord(req, res) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        const token = Jwt.sign({ id: req.id, word: randomWord }, process.env.DRAWING_SECRET, { expiresIn: `${120}s` });
        res.status(200).json({ word: randomWord, token });
    }
};