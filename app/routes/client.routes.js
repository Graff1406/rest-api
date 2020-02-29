module.exports = (app) => {
  const clients = require('../controllers/client.controller.js');
  
  // Create a new Client
  app.post('/api/clients', clients.create);

  // Login a Client
  app.post('/api/clientlogin', clients.login);

  // Get logged client
  app.post('/api/clientlogged', clients.logged);

  app.post('/api/clientlogout', clients.logout);

  // Retrieve all clients
  app.get('/api/clients', clients.findAll);

  // Retrieve a single Client with clientId
  app.get('/api/clients/:id', clients.findOne);

  // Update a Client with clientId - RECOVERY PSW
  app.put('/api/clients', clients.recovery);

  // Update a Client with clientId
  app.put('/api/client/:id', clients.update);

  // Delete a Client with clientId
  app.delete('/api/clients/:id', clients.delete);
}