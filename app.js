// Requires
var express = require('express'); 
var mongoose = require('mongoose'); 
var bodyParser = require('body-parser')

// initial variables
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// import routes
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');

// Contection BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// routes
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);

// listen request
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', 'online');
});