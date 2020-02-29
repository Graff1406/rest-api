module.exports = (app) => {
  const search = require('../controllers/search.controller.js');

  // Retrieve all search
  app.get('/api/search', search.findAll);
}