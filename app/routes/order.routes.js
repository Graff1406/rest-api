module.exports = (app) => {
  const orders = require('../controllers/order.controller.js');
  
  // Create a new Client
  app.post('/orders', orders.create);

  // Retrieve all clients
  app.get('/orders', orders.findAll);

  // Retrieve a single Client with clientId
  app.get('/orders/:id', orders.findOne);

  // Update a Client with clientId
  app.put('/orders/:id', orders.update);

  // Delete a Client with clientId
  app.delete('/orders/:id', orders.delete);
}