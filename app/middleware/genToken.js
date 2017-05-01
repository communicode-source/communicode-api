// JSON Web Tokens = awesome.
const jwt = require('jsonwebtoken');

const userHandler = require('./../handlers/User');

const generate = req => generateToken(req);


// Makes the token.
function generateToken(req) {
  const handler = req._userClass;
  // Makes an expiration date (in minutes).
  const expiration = expiresIn(15);
  if(!handler.isLoggedIn)
    return {err: true, msg: 'Please log in first'};
  let token = jwt.sign({iss: 'communicode-api', id: handler.user._id, exp: expiration}, require('./../config/auth.json').token);
  return {token: token};
}

// Returns the Unix time in X number of minutes.
// (if you don't know what Unix or Epoch or POSIX time is, look it up).
let expiresIn = numMin => new Date(new Date().getTime() + numMin*60000).getTime(); // I love arrow syntax.


module.exports = generate;
