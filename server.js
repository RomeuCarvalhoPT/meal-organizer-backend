// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const dishRoutes = require('./routes/dishes');
const ingredientRoutes = require('./routes/ingredients');
const { Dish, Ingredient, DishIngredient } = require('./models');


const app = express();
app.use(express.json());
app.use(cors());

// Sync models with the database
sequelize.sync() // Use { force: true } for development to drop tables and recreate them
 .then(() => console.log('Database & tables created!'))
 .catch(err => console.error('Error syncing models:', err));

// Use your routes
app.use('/dishes', dishRoutes);
app.use('/ingredients', ingredientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
