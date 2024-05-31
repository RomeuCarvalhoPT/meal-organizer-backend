// routes/menus.js
const express = require("express");
const router = express.Router();
const {
  Menus,
  Dish,
  ShoppingList,
  Ingredient,
  User,
  MenuDishes,
  DishIngredient,
} = require("../models");
const { expressjwt: jwt } = require('express-jwt');


router.use('/', jwt({ secret: 'your_jwt_secret', algorithms: ['HS256'] }));

// Create a new menu
router.post("/generate-menu/:numOfDishes", async (req, res) => {
  try {
    const userId = req.auth.id; // Extract userId from the token
    const numDishes = req.params.numOfDishes;
    const dishes = await Dish.findAll({ include: Ingredient, where: { userId: userId } });
    const randomDishes = getRandomDishes(dishes, numDishes);
    const menu = { dishes: randomDishes }; // Create a menu object without saving it to the database
    const fullMenu = {
      ...menu, // Spread the menu object to include the dishes
      id: -1, // Add a fake ID to the menu object for consistency
    };
    res.json(fullMenu);
  } catch (error) {
    console.error("Error generating menu:", error);
    res.status(500).json({ error: error.message });
  }
});

// Save a menu to the database
router.post("/save", async (req, res) => {
  try {
    const userId = req.auth.id; // Extract userId from the token
    const menuToCreate = req.body;
    //console.log(menuToCreate.dishes);
    // Create a new menu entry
    const newMenu = await Menus.create({ Dishes: menuToCreate.dishes, userId: userId });
    // Loop through each dish and create an entry in MenuDishes
    for (const dish of menuToCreate.dishes) {
      await MenuDishes.create({ MenuId: newMenu.id, DishId: dish.id, userId: userId });
    }
    const updatedMenu = await Menus.findOne({
      where:{id: newMenu.id, userId: userId},
      include: [
        {
          model: Dish,
          include: [
            {
              model: Ingredient,
              through: DishIngredient,
            },
          ],
        },
      ],
    });
    res.json(updatedMenu);
  } catch (error) {
    console.error("Error saving menu:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});




// Get a menu by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.auth.id; // Extract userId from the token
    const id = req.params.id;
    if (id == "all") {
      const menu = await Menus.findAll({
        where: { userId: userId },
        include: [
          {
            model: Dish,
            include: [
              {
                model: Ingredient,
                through: DishIngredient,
              },
            ],
          },
        ],
order: [['createdAt', 'DESC']]
      });
      res.json(menu);
    } else {
      const menu = await Menus.findOne({
        where: { id: id, userId: userId },
        include: [
          {
            model: Dish,
            include: [
              {
                model: Ingredient,
                through: DishIngredient,
              },
            ],
          },
        ],
      });

      if (!menu) {
        return res.status(404).json({ error: "Menu not found" });
      }
      res.json(menu); // Return the menu object
    }
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete a menu by ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.auth.id; // Extract userId from the token
    const id = req.params.id;
    const menu = await Menus.findOne({
      where: { id: id, userId: userId },
    });
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    await menu.destroy();
    res.json({ message: "Menu deleted" });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Helper function to get random dishes
function getRandomDishes(dishes, numDishes) {
  const shuffled = dishes.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numDishes);
}

module.exports = router;
