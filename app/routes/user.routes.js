module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/api/users', users.create);

    // Retrieve all userss
    app.get('/api/users', users.findAll);

    // Retrieve a single Note with noteId
    app.get('/api/users/:id', users.findOne);

    // Update a Note with noteId
    app.put('/api/users/:id', users.update);

    // Delete a Note with noteId
    app.delete('/api/users/:id', users.delete);
}