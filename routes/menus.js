// routes/menus.js
const express = require("express");
const router = express.Router();
const { Menus, Dish,ShoppingList,Ingredient,ShoppingListIngredients,MenuDishes} = require("../models");

// Create a new menu
router.post("/generate-menu/:numOfDishes", async (req, res) => {
  try {

    //await Menus.drop();
    //await ShoppingList.drop();
    //await ShoppingListIngredients.drop();
    //await MenuDishes.drop();
    
    const numDishes  = req.params.numOfDishes;
    const dishes = await Dish.findAll({ include: Ingredient });
    const randomDishes = getRandomDishes(dishes, numDishes);

    const ingredientsSet = new Set();
    randomDishes.forEach(dish => {
      dish.Ingredients.forEach(ingredient => {
        ingredientsSet.add(ingredient);
      });
    });

    const ingredients = Array.from(ingredientsSet);
    const shoppingList = await ShoppingList.create();
    await shoppingList.addIngredients(ingredients);

    const menu = await Menus.create()
    await menu.addDishes(randomDishes);
    await menu.setShoppingList(shoppingList);

    res.json(menu);
  } catch (error) {
    console.error('Error generating menu:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save menu
router.post('/save-menu/:id', async (req, res) => {
  try {
    const menuId = req.params.id;
    const menu = await Menu.findByPk(menuId, { include: [Dish, ShoppingList] });
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    // Here you could add logic to save the menu to a PDF if needed
    // ...

    await menu.save();
    res.json({ status: 'saved', menu });
  } catch (error) {
    console.error('Error saving menu:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get a menu by ID
router.get('/:id', async (req, res) => {
  try {
    const  id  = req.params.id;
    const menu = await Menus.findByPk(id, { include: [Dish, { model: ShoppingList, include: [Ingredient] }] });
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Helper function to get random dishes
function getRandomDishes(dishes, numDishes) {
  const shuffled = dishes.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numDishes);
}

module.exports = router;
