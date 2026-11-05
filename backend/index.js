import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
import { syncDatabase } from "./models/Database.js";
import { authRouter } from "./routes/authRouter.js";
import { sketchRouter } from "./routes/sketchRouter.js";
import { profileRouter } from "./routes/profileRouter.js";
import { leaderboardRouter } from "./routes/leaderboardRouter.js";

const app = express();
const PORT = 3000;
const corsOptions = {
    origin: "http://localhost:4200",
    credentials: true
}

try {
    await syncDatabase().then(() => {
        console.log('Sync successful!');
    });
} catch (error) {
    console.error('Error: ' + error);
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use(authRouter);
app.use(sketchRouter);
app.use(profileRouter);
app.use(leaderboardRouter);

app.use((err, req, res, next) => {
    console.error(err);

    if (err.status === 413) {
        return res.status(413).json({ message: "File too large." });
    } else if (err.status === 400) {
        return res.status(400).json({ message: "Bad request." });
    }

    res.status(500).json({ message: "Internal server error." });
});

app.listen(PORT);