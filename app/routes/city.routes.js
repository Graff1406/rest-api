module.exports = (app) => {
  const cities = require('../controllers/city.controller.js');
  // Retrieve all userss
  app.get('/cities', cities.findAll);
}