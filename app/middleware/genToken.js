var jwt = require('jwt-simple');
//var User = require('./../models/User.js');


var genToken = {
  generate: function(req, res) {
    // Validation here.
    res.status(200).json({"token": generateToken()});
  },

  userGenerate: function(req, res) {
    /**
    * Once the User object has been created then I will be good to go
    *   to start making this upon login.
    **/
  }
}

function generateToken() {
  // Makes an expiration date (in days).
  var expiration = expiresIn(15);
  // Makes the actual token to be returned.
  var token = jwt.encode({iss: 'User', exp: expiration}, require('./../config/auth.json').token);
  return token;
}

function expiresIn(numMin) {
  var dateObj = new Date();
  var expir = new Date(dateObj.getTime() + numMin*60000);
  return expir.getTime();
}

module.exports = genToken;
