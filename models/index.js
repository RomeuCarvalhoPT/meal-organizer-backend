// models/index.js
const Dish = require('./Dish');
const Ingredient = require('./Ingredient');
const DishIngredient = require('./DishIngredient');
const Menus = require('./Menu');
const MenuDishes = require('./MenuDishes');
const User = require('./User');
const { DataTypes } = require('sequelize');

// Associate models
Dish.belongsToMany(Ingredient, { through: DishIngredient });
Ingredient.belongsToMany(Dish, { through: DishIngredient });
Dish.belongsToMany(Menus, { through: MenuDishes });
Menus.belongsToMany(Dish, { through: MenuDishes });
User.hasMany(Dish);
Dish.belongsTo(User);

// Export models
module.exports = {
 Dish,
 Ingredient,
 DishIngredient,
 Menus,
 MenuDishes,
 User,
};
