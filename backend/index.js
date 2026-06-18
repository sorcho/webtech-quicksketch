import express from "express";
import { syncDatabase } from "./models/Database.js";

const app = express();
const PORT = 3000;

try{
    await syncDatabase().then(() => {
      console.log('Sync successful!');
    });
} catch (error) {
    console.error('Error: ' + error);
}

app.listen(PORT);