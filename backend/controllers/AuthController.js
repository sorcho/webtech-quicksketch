import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./../models/Database.js"

export class AuthController {
    static newUser(req, res) {
        let user = new User({
            username: req.body.username,
            password: req.body.password
        });

        return user.save();
    }

    static async checkCreds(req, res) {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) return false;
        return bcrypt.compareSync(req.body.password, user.password);
    }

    static issueToken(username) {
        return Jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: `${24 * 60 * 60}s` });
    }

    static checkToken(token, callback) {
        Jwt.verify(token, process.env.JWT_SECRET, callback);
    }
}