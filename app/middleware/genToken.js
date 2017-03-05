// JSON Web Tokens = awesome.
const jwt = require('jsonwebtoken');

const userHandler = require('./../handlers/User');
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
  const handler = new userHandler(req);
  // Makes an expiration date (in minutes).
  const expiration = expiresIn(15);
  // Makes the actual token to be returned.
  // Note: iss should be either a username or user ID.
  if(!handler.isSignedIn())
    return "Please log in first"

  let token = jwt.sign({iss: handler.getSessUser('email'), exp: expiration}, require('./../config/auth.json').token);
  return token;

}

// Returns the Unix time in X number of minutes.
// (if you don't know what Unix or Epoch or POSIX time is, look it up).
let expiresIn = numMin => new Date(new Date().getTime() + numMin*60000).getTime(); // I love arrow syntax.


module.exports = genToken;
