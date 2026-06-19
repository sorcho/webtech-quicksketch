import express from "express";
import cookieParser from "cookie-parser"
import { syncDatabase } from "./models/Database.js";
import { authRouter } from "./routes/authRouter.js";

const app = express();
const PORT = 3000;

try{
    await syncDatabase().then(() => {
      console.log('Sync successful!');
    });
} catch (error) {
    console.error('Error: ' + error);
}

app.use(express.json());
app.use(cookieParser());

app.use(authRouter);

app.listen(PORT);