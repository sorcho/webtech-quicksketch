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

    static getRandomWord(req, res) {
        const words = ["steak", "moment", "music", "area", "problem", "attention", "world", "software", "buyer", "mud", "exam", "organization", "length", "appearance", "chemistry", "speaker", "people", "disk", "opinion", "assistant", "excitement", "response", "employer", "inspector", "government", "discussion", "gene", "message", "recognition", "tennis", "throat", "clothes", "professor", "decision", "possession", "definition", "contract", "piano", "delivery", "county", "volume", "situation", "contribution", "oven", "celebration", "presence", "town", "wedding", "inspection", "improvement", "physics", "transportation", "application", "operation", "hearing", "performance", "night", "family", "responsibility", "city", "proposal", "injury", "student", "insect", "maintenance", "education", "coffee", "baseball", "elevator", "honey", "perception", "meal", "marketing", "permission", "dad", "hat", "science", "road", "ear", "king", "significance", "bonus", "indication", "passion", "conversation", "comparison", "reality", "addition", "connection", "failure", "gate", "imagination", "region", "sector", "winner", "engineering", "requirement", "loss", "user", "growth", "mood", "sector", "teacher", "conversation", "science", "collection", "movie", "policy", "night", "supermarket", "thought", "consequence", "gate", "ear", "way", "signature", "analysis", "procedure", "significance", "insect", "professor", "employee", "police", "death", "chocolate", "shopping", "suggestion", "population", "village", "investment", "surgery", "king", "bedroom", "examination", "physics", "media", "sample", "celebration", "skill", "direction", "impression", "winner", "menu", "problem", "reception", "platform", "pollution", "area", "departure", "cell", "nation", "criticism", "proposal", "trainer", "committee", "month", "establishment", "message", "user", "control", "painting", "ratio", "uncle", "paper", "agreement", "map", "solution", "technology", "membership", "sir", "tea", "explanation", "lady", "health", "wife", "moment", "drawer", "delivery", "literature", "reflection", "stranger", "engineering", "university", "newspaper", "definition", "office", "height", "description", "bathroom", "assignment", "potato", "library", "election", "recommendation", "charity", "guest", "grandmother", "teaching", "tradition", "mall", "youth", "resolution", "mall", "ladder", "description", "development", "reading", "movie", "relation", "inflation", "bathroom", "piano", "session", "entry", "guitar", "finding", "cousin", "idea", "ability", "university", "drawing", "vehicle", "hospital", "storage", "employment", "appearance", "excitement", "hearing", "chapter", "communication", "explanation", "injury", "fishing", "profession", "truth", "disaster", "criticism", "fortune", "singer", "republic", "engine", "meaning", "nature", "topic", "response", "cell", "woman", "child", "replacement", "user", "measurement", "agreement", "bird", "client", "law", "restaurant", "love", "inspection", "consequence", "cabinet", "math", "wood", "girl", "mode", "passenger", "growth", "feedback", "energy", "property", "player", "tongue", "connection", "studio", "hair", "conversation", "improvement", "city", "highway", "president", "employee", "potato", "attitude", "contract", "honey", "drawer", "region", "library", "association", "solution", "wedding", "phone", "extent", "speaker", "success", "analyst", "internet", "dealer", "editor", "science", "power"];

        const min = 0;
        const max = words.length - 1;
        const randomIndex = Math.floor(Math.random() * (max - min) + min);

        res.status(200).json({ word: words[randomIndex] });
    }
};