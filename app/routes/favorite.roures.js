module.exports = (app) => {
  const favorite = require('../controllers/favorite.controller.js');
  // Retrieve all userss
  app.patch('/favorite', cities.findAll);
}