//var User = require('./../models/User.js');

var userFunctions = {
  login: function(req, res, next) {
    var uniqeID = req.body.email;

  },

  register: function(req, res, next) {

  },

  passwordRecovery: function(req, res, next) {

  },

  isLoggedIn: function(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

}

module.exports = userFunctions;
