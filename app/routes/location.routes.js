module.exports = (app) => {
  const locations = require('../controllers/locations.controller.js');

  // Create a new Location
  app.post('/api/locations', locations.create);

  // Retrieve all Location
  app.get('/api/locations', locations.findAll);

  // Retrieve a single Location with locationId
  app.get('/api/locations/:locationId', locations.findOne);

  // Update a Note with locationId
  app.put('/api/locations/:locationId', locations.update);

  // Delete a Note with locationId
  app.delete('/api/locations/:locationId', locations.delete);
}