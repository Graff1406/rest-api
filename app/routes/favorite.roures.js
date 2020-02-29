module.exports = (app) => {
  const favorite = require('../controllers/favorite.controller.js');
  // Retrieve all userss
  app.patch('/api/favorite', cities.findAll);
}