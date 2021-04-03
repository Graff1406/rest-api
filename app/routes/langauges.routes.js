module.exports = (app) => {
  const langauges = require('../controllers/langauges.controller.js');

  // Create a new Location
  app.post('/api/langauges', langauges.create);

  // Retrieve all Location
  app.get('/api/langauges', langauges.findAll);

  // Retrieve a single Location with locationId
  app.get('/api/langauges/:id', langauges.findOne);

  // Update a Note with locationId
  app.put('/api/langauges/:id', langauges.update);

  // Delete a Note with locationId
  app.delete('/api/langauges/:id', langauges.delete);
}