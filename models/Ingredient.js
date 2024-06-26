const { DataTypes } = require('sequelize');
const sequelize = require('../database');
//const DishIngredient = require('./DishIngredient');
//const Dish = require('./Dish');

const Ingredient = sequelize.define('Ingredient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define the association between Ingredient and Dish
//Ingredient.belongsToMany(Dish, { through: DishIngredient });

module.exports = Ingredient;
