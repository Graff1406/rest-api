module.exports = (app) => {
  const clients = require('../controllers/client.controller.js');
  
  // Create a new Client
  app.post('/clients', clients.create);

  // Login a Client
  app.post('/clientlogin', clients.login);

  // Get logged client
  app.post('/clientlogged', clients.logged);

  app.post('/clientlogout', clients.logout);

  // Retrieve all clients
  app.get('/clients', clients.findAll);

  // Retrieve a single Client with clientId
  app.get('/clients/:id', clients.findOne);

  // Update a Client with clientId - RECOVERY PSW
  app.put('/clients', clients.recovery);

  // Update a Client with clientId
  app.put('/client/:id', clients.update);

  // Delete a Client with clientId
  app.delete('/clients/:id', clients.delete);
}