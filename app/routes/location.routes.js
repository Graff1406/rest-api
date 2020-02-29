module.exports = (app) => {
  const locations = require('../controllers/locations.controller.js');

  // Create a new Location
  app.post('/locations', locations.create);

  // Retrieve all Location
  app.get('/locations', locations.findAll);

  // Retrieve a single Location with locationId
  app.get('/locations/:locationId', locations.findOne);

  // Update a Note with locationId
  app.put('/locations/:locationId', locations.update);

  // Delete a Note with locationId
  app.delete('/locations/:locationId', locations.delete);
}