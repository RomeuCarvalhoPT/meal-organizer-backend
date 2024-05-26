// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const dishRoutes = require('./routes/dishes');
const filesRoutes = require('./routes/files');
const ingredientRoutes = require('./routes/ingredients');
const menusRoutes = require('./routes/menus');
const { Dish, Ingredient, DishIngredient } = require('./models');




const app = express();
app.use(express.json());

const corsOptions = {
  origin: '*', // Allow all origins or replace '*' with your frontend's domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
};

app.use(cors(corsOptions)); // Apply customized CORS settings



// Sync models with the database
sequelize.sync() // Use { force: true } for development to drop tables and recreate them
 .then(() => console.log('Database & tables created!'))
 .catch(err => console.error('Error syncing models:', err));

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Use your routes
app.use('/dishes', dishRoutes);
app.use('/ingredients', ingredientRoutes);
app.use('/files', filesRoutes);
app.use('/menus', menusRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
