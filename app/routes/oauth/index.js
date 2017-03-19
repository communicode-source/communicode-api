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
        successRedirect : '/register/step.2',
        failureRedirect : '/'
    }));
//==============================================================================
// Github Routes. ==============================================================
//==============================================================================
oAuth.route('/github/login')
  .get(passport.authenticate('github', {scope: 'email'}));
oAuth.route('/github/login/callback')
  .get(passport.authenticate('github', {
    successRedirect: '/register/step.2',
    failureRedirect: '/'
  }));
//==============================================================================
// Google Auth Routes. =========================================================
//==============================================================================
oAuth.route('/google/login')
  .get(passport.authenticate('google', {scope: 'email'}));
oAuth.route('/google/login/callback')
  .get(passport.authenticate('google', {
    successRedirect: '/register/step.2',
    failureRedirect: '/'
  }));
//==============================================================================
// Local Auth Routes. ==========================================================
//==============================================================================
oAuth.route('/local/register/dev') // Register Route.
  .post(passport.authenticate('local-signup-dev', {
      successRedirect : '/register/step.2',
      failureRedirect : '/'
  }));
  oAuth.route('/local/register/nonprofit') // Register Route.
    .post(passport.authenticate('local-signup-nonprofit', {
        successRedirect : '/register/step.2',
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
