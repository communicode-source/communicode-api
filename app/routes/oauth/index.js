const oAuth    = require('express').Router(); // I really regret calling this oAuth... --Cooper
const passport = require('passport');
const path     = require('path');
//==============================================================================
// Facebook Routes. ============================================================
//==============================================================================
oAuth.route('/facebook/login')
  .get(passport.authenticate('facebook', { scope : 'email' }));

oAuth.route('/facebook/login/callback')
  .get(passport.authenticate('facebook', {
        successRedirect : '/oauth/profile',
        failureRedirect : '/'
    }));
//==============================================================================
// Github Routes. ==============================================================
//==============================================================================
oAuth.route('/github/login')
  .get(passport.authenticate('github', {scope: 'email'}));
oAuth.route('/github/login/callback')
  .get(passport.authenticate('github', {
    successRedirect: '/oauth/profile',
    failureRedirect: '/'
  }));
//==============================================================================
// Google Auth Routes. =========================================================
//==============================================================================
oAuth.route('/google/login')
  .get(passport.authenticate('google', {scope: 'email'}));
oAuth.route('/google/login/callback')
  .get(passport.authenticate('google', {
    successRedirect: '/oauth/profile',
    failureRedirect: '/'
  }));
//==============================================================================
// Local Auth Routes. ==========================================================
//==============================================================================
oAuth.route('/local/register') // Register Route.
  .post(passport.authenticate('local-signup', {
      successRedirect : '/register/interests',
      failureRedirect : '/'
  }));
oAuth.route('/local/login') // Login Route.
  .post(passport.authenticate('local-login', {
    successRedirect: '/oauth/profile',
    failureRedirect: '/'
  }));

//==============================================================================
// General routes. =============================================================
//==============================================================================
oAuth.route('/profile')
  .get(require('./../../middleware/userLogin').isLoggedIn, (req, res) => {
    res.render("secure/profile.twig", {
      "title": "Profile"
    });
  });
oAuth.route('/logout')
  .get((req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
  });
module.exports = oAuth;
