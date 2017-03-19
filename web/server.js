var express    = require('express');
var path       = require("path");
var app        = express();
var bodyParser = require('body-parser');
var sanitize  = require('./app/middleware/secureForm');
var logger    = require('morgan');

var twig = require("twig");
// This section is optional and used to configure twig.
app.set("twig options", {
    strict_variables: false
});

var mongoose = require('mongoose');
var redis    = require('./app/config/sessions')(app);
var passport = require('passport');

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
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 3);


// THIS MUST COME BEFORE ANYTHING SESSION-DEPENDENT HAPPENS. ==================================================
require('./app/config/sessions')(app);
app.use(passport.initialize());
app.use(passport.session());
require('./app/config/passportConfig')(passport);

// PLEASE DON'T MOVE THIS =====================================================================================
// Token authentication required for all /secure api endpoints.
app.all('/api/secure/*', [require('./app/middleware/validateRequest')]);
app.use('/web/*', [require('./app/middleware/userLogin').ensureNotLogged]);

app.use('/', express.static(path.join(__dirname, 'views/public'), {
  extensions: ['html']
}));
app.use('/Images', express.static(path.join(__dirname, 'public/Images'), {
  extensions: ['css']
}));


app.use('/Images', express.static(path.join(__dirname, 'public/Images')));

app.use('/css', express.static(path.join(__dirname, 'public/css'), {
  extensions: ['css']
}));
app.use('/js', express.static(path.join(__dirname, 'public/js'), {
  extensions: ['js']
}));

app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));

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
