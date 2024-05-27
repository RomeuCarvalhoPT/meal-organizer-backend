// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
const dishRoutes = require('./routes/dishes');
const filesRoutes = require('./routes/files');
const ingredientRoutes = require('./routes/ingredients');
const menusRoutes = require('./routes/menus');
const usersRoutes = require('./routes/users');
const { Dish, Ingredient, DishIngredient,Users, Menus, MenuDishes } = require('./models');
const https = require('https');
const fs = require('fs');



const app = express();
app.use(express.json());

const allowedOrigins = ['https://44f653f5-ffd5-4b16-9b07-5c38eae21ce0-00-2f8wfwl8eu9qj.riker.replit.dev',
                        'http://192.168.1.112', 
                        /\.246436646\.xyz$/];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin) return callback(null, true);

    // Check if the origin is in the list of allowed origins
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
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
app.use('/users', usersRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
