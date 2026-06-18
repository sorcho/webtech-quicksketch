import { DataTypes, Sequelize } from "sequelize";

export function createModel(database) {
    database.define('Try', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tries_used: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        solved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    })
}