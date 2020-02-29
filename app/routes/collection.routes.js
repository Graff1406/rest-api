module.exports = (app) => {
  const collections = require('../controllers/collection.controller.js');
  // Retrieve all collections
  app.get('/api/collections', collections.findAll);
}