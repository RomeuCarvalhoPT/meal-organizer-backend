const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    noNull: true,
  },
  password: {
    type: DataTypes.STRING,
    noNull: true,
  },
});


module.exports = User;
