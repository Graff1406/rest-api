module.exports = (app) => {
  const favors = require('../controllers/favor.controller.js');

  // Update a Client with clientId
  app.put('/api/favors/:id', favors.update);
}