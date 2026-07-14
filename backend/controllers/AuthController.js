import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./../models/Database.js"

export class AuthController {
    static async newUser(req, res) {
        try {
            let user = new User({
                username: req.body.username,
                password: req.body.password
            });

            await user.save();

            res.status(201).json({ message: "Registration completed." })
        } catch (err) {
            res.status(400).json({ message: "Error during the registration." })
        }
    }

    static async checkCreds(req, res) {
        const user = await User.findOne({ where: { username: req.body.username } });

        if (!user) {
            return res.status(400).json({ message: "No user found with given username." });
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).json({ message: "Password didn't match." });
        }

        const token = AuthController.issueToken(user.id);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ message: 'Logged in successfully.' });
    }

    static issueToken(id) {
        return Jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: `${24 * 60 * 60}s` });
    }

    static checkToken(token, callback) {
        Jwt.verify(token, process.env.JWT_SECRET, callback);
    }
}