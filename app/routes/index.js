const routes     = require('express').Router();
const greetings  = require('./greetings');
const mailDaemon = require('./mail');
const token      = require('./../middleware/genToken');
const auth       = require('./../config/auth.json');
const AuthRoutes = require('./oauth');
const UserRoutes = require('./users');
const developers = require('./users/developers');
const nonprofits = require('./users/nonprofits');
const profile    = require('./profile');
const JwtRoutes  = require('./token');
const test  = require('./test');
const userInt    = require('../handlers/User');
const path       = require('path');
const projects   = require('./projects');
// Telling express what route goes to this greeting.
routes.use('/api/greeting', greetings);
routes.use('/api/secure/mail', mailDaemon);
routes.use('/api/secure/check', test);
routes.use('/api/users', UserRoutes);
routes.use('/api/developers', developers);
routes.use('/api/nonprofits', nonprofits);
routes.use('/oauth', AuthRoutes);
routes.use('/', profile);
// The actual generating of the token should be done when a user logs in or something.
routes.use('/api/token', JwtRoutes);
routes.use('/api/projects', projects);
// res = response, req = request.
// More routing, telling express what to send back.
routes.get('/api', (req, res) => {
  res.status(200).json({ message: 'Connection Made!' });
});

routes.get('/findPath', (req, res) => {
  const u = req._userClass;
  u.getUserAttributes(['interests'], u.getSessUser('_id'),  function(err, interests) {
    if(interests !== null && interests['interests'] && interests['interests'] !== null && interests['interests'].length > 0) {
      res.redirect('/');
    } else {
      res.redirect('/register/step.2');
    }
  });
});

routes.get('/:user', (req, res) => {
  var getData = req._userClass;
  getData.getUrl(req.params.user, function(err, users){
    if(err || users.length > 1) {
      res.status(200).send(err+'Failed');
      return;
    }
    var user = users[0];
    if(!user) {
      res.status(200).send('No username exists');
      return;
    }
    getData.getProfile(user.userId, function(err, user) {
      res.render('secure/profile-dev.twig', {
        "profile": user
      });
    });
  });
});

routes.get('/', (req, res) => {
  if(req._userClass.isLoggedIn === false){
    res.render("public/index.twig", {
      "title": "Welcome to Communicode"
    })
  } else {
    res.render("secure/dashboard.twig", {
      "title": "Welcome to Communicode"
    })
  }
});

// Exporting it.
module.exports = routes;
