// models/index.js
const Dish = require('./Dish');
const Ingredient = require('./Ingredient');
const DishIngredient = require('./DishIngredient');

// Associate models
Dish.belongsToMany(Ingredient, { through: DishIngredient });
Ingredient.belongsToMany(Dish, { through: DishIngredient });

// Export models
module.exports = {
 Dish,
 Ingredient,
 DishIngredient,
};
