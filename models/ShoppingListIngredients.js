const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ShoppingListIngredients = sequelize.define('ShoppingListIngredients', {});



module.exports = ShoppingListIngredients;
