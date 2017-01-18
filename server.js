// server.js

var express  = require('express');
var path     = require("path");
var app      = express();

var bodyParser = require('body-parser');
var logger     = require('morgan');
var mongoose   = require('mongoose');

const database = require('./app/config/database.js');
mongoose.connect(database.url);
mongoose.connection.on('error', function() {
  console.info("Could not run mongodb, did you forget to run mongod?");
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'web')));

// Load our routes here.
var routes = require('./app/routes');
app.use('/', routes);

// Watch the magic happen...
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
