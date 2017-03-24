const routes     = require('express').Router();
const token      = require('./../middleware/genToken');
const auth       = require('./../config/auth.json');
const AuthRoutes = require('./oauth');
const profile    = require('./profile');
const JwtRoutes  = require('./token');
const userInt    = require('../handlers/User');
const path       = require('path');
routes.use('/oauth', AuthRoutes);
routes.use('/', profile);
routes.use('/token', JwtRoutes);

routes.get('/findPath', (req, res) => {
  const u = new userInt(req);
  u.getUserAttributes(['interests'], u.getSessUser('_id'),  function(err, interests) {
    if(interests['interests'] && interests['interests'] !== null && interests['interests'].length > 0) {
      res.redirect('/');
    } else {
      res.redirect('/register/step.2');
    }
  });
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