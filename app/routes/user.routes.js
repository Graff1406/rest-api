module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Login a Client
    app.post('/api/userlogin', users.login);

    // Get logged client
    app.post('/api/userlogged', users.logged);

    // Create a new User
    app.post('/api/users', users.create);

    // Create a new User
    app.post('/api/users/join', users.join);

    // Recovery psw
    app.post('/api/users/recovery', users.recoveryPsw);

    // Retrieve all userss
    app.get('/api/users', users.findAll);

    // Retrieve a single Note with noteId
    app.get('/api/users/:id', users.findOne);

    // Update a Note with noteId
    app.put('/api/users/:id', users.update);

    // Delete a Note with noteId
    app.delete('/api/users/:id', users.delete);
}