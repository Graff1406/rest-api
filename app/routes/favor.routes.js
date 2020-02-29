module.exports = (app) => {
  const favors = require('../controllers/favor.controller.js');

  // Update a Client with clientId
  app.put('/favors/:id', favors.update);
}