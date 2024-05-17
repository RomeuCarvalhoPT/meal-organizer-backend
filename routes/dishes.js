// routes/dishes.js
const express = require("express");
const router = express.Router();
const { Dish, Ingredient, DishIngredient } = require("../models");




// Create a new dish
router.post("/", async (req, res) => {
  try {
    const { name, picture, Ingredients } = req.body;
    const dish = await Dish.create({ name, picture });
    const dishId = dish.id; // Make sure to get the ID of the newly created dish
    if (Ingredients && Ingredients.length > 0) {
      for (const ingredient of Ingredients) {
        const { id,name, DishIngredient: newDishIngredient } = ingredient;
        const {quantity} = newDishIngredient;
        const [ingredientInstance, created] = await Ingredient.findOrCreate({
          where: { name: name },
          defaults: { name: name },
        });
        if (ingredientInstance) {
          await DishIngredient.create({
            DishId: dish.id,
            IngredientId: ingredientInstance.id,
            quantity: quantity,
          });
        }

      }
    }
    res.status(201).json(dish);
  } catch (err) {
    res.status(500).json({ message: err.original.message});
  }
});

// Retrieve all dishes
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.findAll({
      include: [
        {
          model: Ingredient,
          through: DishIngredient,
          as: "Ingredients",
        },
      ],
    });
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/aaa", async (req, res) => {
  try {
    const dishes = await DishIngredient.findAll();
    res.json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve a dish by ID
router.get("/:id", async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id, {
      include: [
        {
          model: Ingredient,
          through: DishIngredient,
          as: "Ingredients",
        },
      ],
    });
    if (dish) {
      res.json(dish);
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a dish by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, picture, Ingredients } = req.body;
    const dish = await Dish.findByPk(req.params.id);
    if (dish) {
      await dish.update({ name, picture });


      console.log(await DishIngredient.findAll());


      
      await DishIngredient.destroy({ where: { DishId: dish.id } }); 

      console.log(await DishIngredient.findAll());
      // Add new associations
      if (Ingredients && Ingredients.length > 0) {
        for (const ingredient of Ingredients) {
          const { id,name, DishIngredient: newDishIngredient } = ingredient;
          const {quantity} = newDishIngredient;
          const [ingredientInstance, created] = await Ingredient.findOrCreate({
            where: { name: name },
            defaults: { name: name },
          });
          if (ingredientInstance) {
            await DishIngredient.create({
              DishId: dish.id,
              IngredientId: ingredientInstance.id,
              quantity: quantity,
            });
          }
          
        }
      }
      res.json(dish);
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a dish by ID
router.delete("/:id", async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);
    if (dish) {
      await dish.destroy();
      res.json({ message: "Dish deleted" });
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve all dishes that contain a certain ingredient
router.get("/containing/:ingredientName", async (req, res) => {
  try {
    const { ingredientName } = req.params;
    const dishes = await Dish.findAll({
      include: [
        {
          model: Ingredient,
          through: DishIngredient,
          as: "ingredients",
          where: {
            name: ingredientName,
          },
        },
      ],
    });
    if (dishes.length > 0) {
      res.json(dishes);
    } else {
      res
        .status(404)
        .json({
          message: "No dishes found containing the specified ingredient",
        });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
