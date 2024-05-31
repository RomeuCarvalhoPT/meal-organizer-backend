// routes/ingredients.js
const express = require("express");
const router = express.Router();
const { Dish, Ingredient, DishIngredient } = require("./../models");
const { expressjwt: jwt } = require("express-jwt");

router.use("/", jwt({ secret: "your_jwt_secret", algorithms: ["HS256"] }));

// Create a new ingredient
router.post("/", async (req, res) => {
  try {
    const userId = req.auth.id; // Extract username from the token
    const { name, picture } = req.body;
    const ingredient = await Ingredient.create({ name, picture, userId });
    res.status(201).json(ingredient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve all ingredients
router.get("/", async (req, res) => {
  try {
    const userId = req.auth.id; // Extract username from the token
    const ingredients = await Ingredient.findAll({ where: { userId: userId } });
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Retrieve an ingredient by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.auth.id; // Extract username from the token
    const ingredient = await Ingredient.findOne({
      where: { id: req.params.id, userId: userId },
    });
    if (ingredient) {
      res.json(ingredient);
    } else {
      res.status(404).json({ message: "Ingredient not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an ingredient by ID
router.put("/:id", async (req, res) => {
  try {
    const userId = req.auth.id; // Extract username from the token
    const { name, picture } = req.body;
    const ingredient = await Ingredient.findOne({
      where: { id: req.params.id, userId: userId },
    });
    if (ingredient) {
      await ingredient.update({ name, picture, userId });
      res.json(ingredient);
    } else {
      res.status(404).json({ message: "Ingredient not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an ingredient by ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.auth.id; // Extract username from the token
    const ingredient = await Ingredient.findOne({
      where: { id: req.params.id, userId: userId },
    });
    if (ingredient) {
      await ingredient.destroy();
      res.json({ message: "Ingredient deleted" });
    } else {
      res.status(404).json({ message: "Ingredient not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
