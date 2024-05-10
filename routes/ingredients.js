// routes/ingredients.js
const express = require('express');
const router = express.Router();
const { Dish, Ingredient, DishIngredient } = require('./../models');


// Create a new ingredient
router.post('/', async (req, res) => {
 try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json(ingredient);
 } catch (err) {
    res.status(500).json({ message: err.message });
 }
});

// Retrieve all ingredients
router.get('/', async (req, res) => {
 try {
    const ingredients = await Ingredient.findAll();
    res.json(ingredients);
 } catch (err) {
    res.status(500).json({ message: err.message });
 }
});

// Retrieve an ingredient by ID
router.get('/:id', async (req, res) => {
 try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (ingredient) {
      res.json(ingredient);
    } else {
      res.status(404).json({ message: 'Ingredient not found' });
    }
 } catch (err) {
    res.status(500).json({ message: err.message });
 }
});

// Update an ingredient by ID
router.put('/:id', async (req, res) => {
 try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (ingredient) {
      await ingredient.update(req.body);
      res.json(ingredient);
    } else {
      res.status(404).json({ message: 'Ingredient not found' });
    }
 } catch (err) {
    res.status(500).json({ message: err.message });
 }
});

// Delete an ingredient by ID
router.delete('/:id', async (req, res) => {
 try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (ingredient) {
      await ingredient.destroy();
      res.json({ message: 'Ingredient deleted' });
    } else {
      res.status(404).json({ message: 'Ingredient not found' });
    }
 } catch (err) {
    res.status(500).json({ message: err.message });
 }
});


module.exports = router;
