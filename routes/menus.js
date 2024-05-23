// routes/menus.js
const express = require("express");
const router = express.Router();
const {
  Menus,
  Dish,
  ShoppingList,
  Ingredient,
  ShoppingListIngredients,
  MenuDishes,
  DishIngredient,
} = require("../models");

// Create a new menu
router.post("/generate-menu/:numOfDishes", async (req, res) => {
  try {
    const numDishes = req.params.numOfDishes;
    const dishes = await Dish.findAll({ include: Ingredient });
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
    const menuToCreate = req.body;
    console.log(menuToCreate.dishes);
    // Create a new menu entry
    const newMenu = await Menus.create({ Dishes: menuToCreate.dishes });
    // Loop through each dish and create an entry in MenuDishes
    for (const dish of menuToCreate.dishes) {
      await MenuDishes.create({ MenuId: newMenu.id, DishId: dish.id });
    }
    const updatedMenu = await Menus.findByPk(newMenu.id, {
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
    const id = req.params.id;
    if (id == "all") {
      const menu = await Menus.findAll({
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
      const menu = await Menus.findByPk(id, {
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

// Get a shopping list for a menu
router.get("/:id/shopping-list", async (req, res) => {
  try {
    const id = req.params.id;

    const menu = await Menus.findByPk(id, {
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

    const shoppingList = {};
    // Loop through each dish in the menu
    for (const dish of menu.Dishes) {
      // Loop through each ingredient in the dish
      for (const ingredient of dish.Ingredients) {
        // If the ingredient is already in the shopping list, add its quantity to the existing entry
        if (shoppingList[ingredient.name]) {
          shoppingList[ingredient.name] += " + " + ingredient.DishIngredient.quantity;
        } else {
          // Otherwise, add the ingredient to the shopping list with its quantity
          shoppingList[ingredient.name] = ingredient.DishIngredient.quantity;
        }
      }
    }

    // Sort the shopping list alphabetically
    const sortedShoppingList = Object.entries(shoppingList)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    res.json(sortedShoppingList);
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Delete a menu by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const menu = await Menus.findByPk(id);

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
