module.exports = (app) => {
  const collections = require('../controllers/collection.controller.js');
  // Retrieve all collections
  app.get('/collections', collections.findAll);
}