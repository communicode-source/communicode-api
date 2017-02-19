// Web development framework, mostly used for routing here.
var express    = require('express');
// Used for routing.
var path       = require("path");
// Instantiation of the Express object.
var app        = express();
// Helps with returning JSON in the correct fromat.
var bodyParser = require('body-parser');

var sanitize  = require('./app/middleware/secureForm');
// Logging things.
var logger     = require('morgan');
// Mongo database schema... Because we need a schema for our schemaless database service...
var mongoose   = require('mongoose');
// Session Configuration
var redis = require('./app/config/sessions')(app);
// Login stuff.
var passport = require('passport');
// DB Stuff.

const database = require('./app/config/database.js');
// Making a connection to the Mongo database, and returning an error on failure.
mongoose.connect(database.url);
mongoose.connection.on('error', function() {
  console.info("Could not run mongodb, did you forget to run mongod?");
});

// Middleware stuff.
// These tell Express what we are using for what.
app.use(bodyParser.json());
// Telling the body parser we are using the URL for information.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sanitize);
app.use(logger('dev'));
// What port to start the HTTP(S) server.
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 3); // Now we can read the freaking json outputs. YEAH.
// Session stuff
// THIS MUST COME BEFORE ANYTHING SESSION-DEPENDENT HAPPENS. ==================================================
//app.use(require('express-session')({ secret: 'keyboard cat...meow', saveUninitialized: true, resave: true}));
require('./app/config/sessions')(app);
app.use(passport.initialize());
app.use(passport.session());
require('./app/config/passportConfig')(passport);
// PLEASE DON'T MOVE THIS =====================================================================================
// Token authentication required for all /secure api endpoints.
app.all('/api/secure/*', [require('./app/middleware/validateRequest')]);
app.use('/public/authenticate*', [require('./app/middleware/userLogin').ensureNotLogged]);
app.use('/public', express.static(path.join(__dirname, 'web/html/public'), {
  extensions: ['html']
}));
app.use('/css', express.static(path.join(__dirname, 'web/css'), {
  extensions: ['css']
}));
app.use('/js', express.static(path.join(__dirname, 'web/js'), {
  extensions: ['js']
}));

app.all('/*', function(req, res, next){
  // Allows cross site scripting.
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,OPTIONS');
  // Set Custom Headers
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  next();
});

// Routing stuff.

// Load our routes here.
var routes = require('./app/routes');
app.use('/', routes);

// Watch the magic happen... (Starting the actual HTTP(S) server).
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
