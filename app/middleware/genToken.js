var jwt = require('jwt-simple');

var genToken = {
  generate: function(req, res) {
    // Validation here.
    res.status(200).json({"token": generateToken()});
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
  console.log(expir);
  return expir.getTime();
}

module.exports = genToken;
