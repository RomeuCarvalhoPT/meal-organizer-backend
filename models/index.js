// models/index.js
const Dish = require('./Dish');
const Ingredient = require('./Ingredient');
const DishIngredient = require('./DishIngredient');
const Menus = require('./Menu');
const ShoppingList = require('./ShoppingList');
const ShoppingListIngredients = require('./ShoppingListIngredients');
const MenuDishes = require('./MenuDishes');

// Associate models
Dish.belongsToMany(Ingredient, { through: DishIngredient });
Ingredient.belongsToMany(Dish, { through: DishIngredient });
Dish.belongsToMany(Menus, { through: 'MenuDishes' });
Menus.belongsToMany(Dish, { through: 'MenuDishes' });
Dish.belongsToMany(Menus, { through: 'MenuDishes' });
Menus.belongsTo(ShoppingList);
ShoppingList.hasOne(Menus);
ShoppingList.belongsToMany(Ingredient, { through: 'ShoppingListIngredients' });
Ingredient.belongsToMany(ShoppingList, { through: 'ShoppingListIngredients' });

// Export models
module.exports = {
 Dish,
 Ingredient,
 DishIngredient,
 Menus,
 ShoppingList,
 ShoppingListIngredients,
 MenuDishes
};
