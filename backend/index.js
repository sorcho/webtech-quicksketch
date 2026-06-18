import express from "express";
import { Sequelize } from "@sequelize/core"
import { PostgresDialect } from "@sequelize/postgres";

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: process.env.DB,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: 'localhost',
  port: process.env.PORT
});

const app = express();