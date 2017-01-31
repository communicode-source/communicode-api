var User = require('./../models/User.js');

var userFunctions = {
  isLoggedIn: function(req, res, next) {

    // If user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // If they aren't redirect them to the home page
    res.redirect('/');
  },
  mergeUsers: function(oldUser, newUser, fields) {
    if(oldUser.Provider != 'local')
      return false;
    for(var key in fields){
      newUser[key] = (oldUser[key]) ? oldUser[key] : (newUser[key]) ? newUser[key] : null;
    }
    return newUser;
  }
}

module.exports = userFunctions;
