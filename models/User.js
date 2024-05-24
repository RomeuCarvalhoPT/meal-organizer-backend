const { DataTypes } = require('sequelize');
const sequelize = require("../database");

const Users = sequelize.define('Users', {
  username: {
    type: DataTypes.STRING,
    noNull: true,
    unique: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    noNull: true,
  },
});
console.log(Users === sequelize.models.User);

module.exports = Users;
