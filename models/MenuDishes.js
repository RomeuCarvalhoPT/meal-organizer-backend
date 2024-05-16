const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const MenuDishes = sequelize.define('MenuDishes', {});



module.exports = MenuDishes;
