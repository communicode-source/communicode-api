var express    = require('express');
var path       = require("path");
var app        = express();
var bodyParser = require('body-parser');
var sanitize   = require('./app/middleware/secureForm');
var logger     = require('morgan');

var mongoose = require('mongoose');

const database = require('./app/config/database.js');
mongoose.connect(database.url);
mongoose.connection.on('error', function() {
  console.info("Could not run mongodb, did you forget to run mongod?");
});

// Middleware stuff.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sanitize);
app.use(logger('dev'));
app.set('port', process.env.PORT || 3001);
app.set('json spaces', 3);


// Token authentication required for all /secure api endpoints.
app.all('/api/secure/*', [require('./app/middleware/validateRequest')]);

app.all('/*', function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  next();
});

// Routing stuff.
var routes = require('./app/routes');
app.use('/', routes);

// Watch the magic happen... (Starting the actual HTTP(S) server).
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
