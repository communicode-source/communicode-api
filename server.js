// server.js

// Web development framework, mostly used for routing here.
var express  = require('express');

// Used for routing.
var path     = require("path");

// Instantiation of the Express object.
var app      = express();

// Helps with returning JSON in the correct fromat.
var bodyParser = require('body-parser');
// Logging things.
var logger     = require('morgan');
// Mongo database schema... Because we need a schema for our schemaless database service...
var mongoose   = require('mongoose');

const database = require('./app/config/database.js');
// Making a connection to the Mongo database, and returning an error on failure.
mongoose.connect(database.url);
mongoose.connection.on('error', function() {
  console.info("Could not run mongodb, did you forget to run mongod?");
});

// These tell Express what we are using for what.
app.use(logger('dev'));
app.use(bodyParser.json());
// What port to start the HTTP(S) server.
app.set('port', process.env.PORT || 3000);
// Telling the body parser we are using the URL for information.
app.use(bodyParser.urlencoded({ extended: false }));
// Serving static files via this path.
app.use(express.static(path.join(__dirname, 'web')));

// Load our routes here.
var routes = require('./app/routes');
app.use('/', routes);

// Watch the magic happen... (Starting the actual HTTP(S) server).
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
