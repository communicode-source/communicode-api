var User = require('./../models/User.js');

var userFunctions = {
  isLoggedIn: function(req, res, next) {

    // If user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // If they aren't redirect them to the home page
    res.redirect('/');
  },
}

module.exports = userFunctions;
