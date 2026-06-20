import 'dotenv/config.js'
import { Sequelize } from "sequelize"
import { createModel as createUserModel } from "./User.js";
import { createModel as createSketchModel } from './Sketch.js';
import { createModel as createTryModel } from './Try.js';

export const database = new Sequelize(process.env.DB_CONNECTION_URI, {
    dialect: process.env.DIALECT
});

createUserModel(database); 
createSketchModel(database);
createTryModel(database);

export const {User, Sketch, Try} = database.models;

User.hasMany(Sketch);
Sketch.belongsTo(User);

User.hasMany(Try);
Sketch.hasMany(Try);
Try.belongsTo(User);
Try.belongsTo(Sketch);

export async function syncDatabase() {
    return database.sync({alter: true});
}