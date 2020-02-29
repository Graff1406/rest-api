module.exports = (app) => {
  const orders = require('../controllers/order.controller.js');
  
  // Create a new Client
  app.post('/api/orders', orders.create);

  // Retrieve all clients
  app.get('/api/orders', orders.findAll);

  // Retrieve a single Client with clientId
  app.get('/api/orders/:id', orders.findOne);

  // Update a Client with clientId
  app.put('/api/orders/:id', orders.update);

  // Delete a Client with clientId
  app.delete('/api/orders/:id', orders.delete);
}