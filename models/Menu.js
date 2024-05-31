const { DataTypes } = require('sequelize');
const sequelize = require("../database");
const User = require('./User');

const Menus = sequelize.define('Menus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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



module.exports = Menus;
