const app = require('express')();
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require('express-session')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json({limit: '50mb', extended: true}))

app.use(cors({
    // origin:['https://go-geo.herokuapp.com'],
    origin:['http://localhost:3000'],
    methods:['GET','POST','PUT','DELETE'],
    credentials: true // enable set cookie
}))


app.use(session({
    secret: 'Q3UBzdH9GJaemhg5J25dgEfiRCTKbi5MTPyChYjdUd58NdhpzXLsTD',
    resave: false,
    saveUninitialized: true
}))

app.put('/api/client/:id', function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

// Connecting to the database
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

require('./app/routes/user.routes.js')(app);
require('./app/routes/city.routes.js')(app);
require('./app/routes/search.routes.js')(app);
require('./app/routes/collection.routes.js')(app);
require('./app/routes/location.routes.js')(app);
require('./app/routes/client.routes.js')(app);
require('./app/routes/order.routes.js')(app);
require('./app/routes/favor.routes.js')(app);
require('./app/routes/langauges.routes.js')(app);

// listen for requests
// app.listen(process.env.PORT || 3000, () => {
//     console.log("Server is listening on port -", process.env.PORT);
// });
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});