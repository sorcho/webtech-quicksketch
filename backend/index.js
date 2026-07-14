import express from "express";
import cookieParser from "cookie-parser"
import { syncDatabase } from "./models/Database.js";
import { authRouter } from "./routes/authRouter.js";
import { sketchRouter } from "./routes/sketchRouter.js";
import { profileRouter } from "./routes/profileRouter.js";
import { leaderboardRouter } from "./routes/leaderboardRouter.js";

const app = express();
const PORT = 3000;

try {
    await syncDatabase().then(() => {
        console.log('Sync successful!');
    });
} catch (error) {
    console.error('Error: ' + error);
}

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use(authRouter);
app.use(sketchRouter);
app.use(profileRouter);
app.use(leaderboardRouter);

app.listen(PORT);