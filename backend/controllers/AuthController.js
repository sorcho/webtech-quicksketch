import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./../models/Database.js"

export class AuthController {
    static async newUser(req, res) {
        const regex = new RegExp("^((?=\\S*?[A-Z])(?=\\S*?[a-z])(?=\\S*?[0-9])\\S{6,})$")
        try {
            const existing = await User.findOne({ where: { username: req.body.username } });

            if (existing) {
                return res.status(409).json({ message: "A user with this username already exists." })
            }

            if (!req.body.username || !req.body.password) {
                return res.status(400).json({ message: "Username and password are required." });
            }

            if (!regex.test(req.body.password)) {
                return res.status(400).json({ message: "Password isn't strong enough." });
            }

            let user = new User({
                username: req.body.username,
                password: req.body.password
            });

            await user.save();

            res.status(201).json({ message: "Registration completed." })
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ message: "Error during the registration." });
        }
    }

    static async checkCreds(req, res) {
        try {
            const user = await User.findOne({ where: { username: req.body.username } });

            if (!req.body.username || !req.body.password) {
                return res.status(400).json({ message: "Username and password are required." });
            }

            if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(401).json({ message: "Wrong username or password." });
            }

            const token = AuthController.issueToken(user.id);

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            })

            return res.status(200).json({ message: 'Logged in successfully.' });
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ message: "Error during the login." });
        }
    }

    static issueToken(id) {
        return Jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: `${24 * 60 * 60}s` });
    }

    static checkToken(token, callback) {
        Jwt.verify(token, process.env.JWT_SECRET, callback);
    }
}