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
const userInt    = require('../handlers/User');
const path       = require('path');

// Telling express what route goes to this greeting.
routes.use('/api/greeting', greetings);
routes.use('/api/secure/mail', mailDaemon);
routes.use('/api/users', UserRoutes);
routes.use('/api/developers', developers);
routes.use('/api/nonprofits', nonprofits);
routes.use('/oauth', AuthRoutes);
routes.use('/', profile);
// The actual generating of the token should be done when a user logs in or something.
routes.use('/api/token', JwtRoutes);

// res = response, req = request.
// More routing, telling express what to send back.
routes.get('/api', (req, res) => {
  res.status(200).json({ message: 'Connection Made!' });
});


routes.get('/:user', (req, res) => {
  var getData = new userInt(req);
  getData.getUrl(req.params.user, function(err, users){
    if(err || users.length > 1) {
      console.log(users);
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
  if(new userInt(req).isSignedIn() === false){
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
