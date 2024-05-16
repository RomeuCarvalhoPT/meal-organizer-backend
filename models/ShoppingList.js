const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ShoppingList = sequelize.define("ShoppingList", {});

module.exports = ShoppingList;
