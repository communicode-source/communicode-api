var oAuth = require('express').Router();
var passport = require('passport');

// Facebook Routes.
oAuth.route('/facebook/login')
  .get(passport.authenticate('facebook', { scope : 'email' }));

oAuth.route('/facebook/login/callback')
  .get(passport.authenticate('facebook', {
        successRedirect : '/oauth/profile',
        failureRedirect : '/'
    }));

// Github Routes.
oAuth.route('/github/login')
  .get(passport.authenticate('github', {scope: 'email'}));
oAuth.route('/github/login/callback')
  .get(passport.authenticate('github', {
    successRedirect: '/oauth/profile',
    failureRedirect: '/'
  }));

// Local Auth routes.
oAuth.route('/local/register')
  .post(passport.authenticate('local-signup', {
    successRedirect : '/oauth/profile',
    failureRedirect : '/'
  }));
oAuth.route('/local/login')
  .post(passport.authenticate('local-login', {
    successRedirect: '/oauth/profile',
    failureRedirect: '/'
  }));


// General routes.
oAuth.route('/profile')
  .get(require('./../../middleware/userLogin').isLoggedIn, (req, res) => {
    res.send(req.user.email+"<br/><a href='http://localhost:3000/oauth/logout'>Logout</a>");
  });
oAuth.route('/logout')
  .get((req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
  });
module.exports = oAuth;
