// JSON Web Tokens = awesome.
var jwt = require('jwt-simple');
//var User = require('./../models/User.js');


var genToken = {
  // For lazy developers who secure their api endpoints but then want an easy way to access them...
  generate: function(req, res) {
    // Validation here.
    res.status(200).json({token: generateToken(req)});
  },
  returnKeytoken: function(email) {
    return jwt.encode({iss: email}, require('./../config/auth.json'));
  },
  userGenerate: function(req, res) {
    /**
    * Once the User object has been created then I will be good to go
    *   to start making this upon login or register.
    **/
  }
}
// Makes the token.
function generateToken(req) {
  // Makes an expiration date (in days).
  var expiration = expiresIn(15);
  // Makes the actual token to be returned.
  // Note: iss should be either a username or user ID.
  if(!req.user)
    return "Please log in first"

  var token = jwt.encode({iss: req.user.email, exp: expiration}, require('./../config/auth.json').token);
  return token;

}

// Returns the Unix time in X number of minutes.
// (if you don't know what Unix or Epoch or POSIX time is, look it up).
function expiresIn(numMin) {
  var dateObj = new Date(); // Creates the current date object.
  var expir = new Date(dateObj.getTime() + numMin*60000); // Gets the date time in X minutes.
  return expir.getTime(); // Returns the Unix time for comparison later on.
}

module.exports = genToken;
