// models/DishIngredient.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');


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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'userId'
        }
      }
});

module.exports = DishIngredient;
