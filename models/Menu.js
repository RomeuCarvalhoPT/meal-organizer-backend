const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const Menus = sequelize.define('Menus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }  
});



module.exports = Menus;
