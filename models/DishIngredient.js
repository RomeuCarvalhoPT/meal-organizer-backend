// models/DishIngredient.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');


const DishIngredient = sequelize.define('DishIngredient', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
 quantity: {
    type: DataTypes.STRING,
    allowNull: true,
 },
});

module.exports = DishIngredient;
