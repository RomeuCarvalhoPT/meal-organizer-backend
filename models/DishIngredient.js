// models/DishIngredient.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');


const DishIngredient = sequelize.define('DishIngredient', {

 quantity: {
    type: DataTypes.STRING,
    allowNull: true,
 },
});

module.exports = DishIngredient;
