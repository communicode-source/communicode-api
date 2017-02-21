var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

  // Numerous ways of sending in the token.
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || (req.query.token);
  // Some type of user auth... It can't be any token, it has to be a specific one to the user.
  var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'] || req.query.name;
  if(!req.isAuthenticated) {
    res.status(200).json({err: true, msg: "You must log in first."});
    return;
  }
  if( token || key ) {
    try {
      // This is how the token is checked.
      var decode = jwt.verify(token, require('./../config/auth.json').token);

      // Checks the date and returns an error if it has expired.
      if(decode.exp <= Date.now()) {
        res.status(200).json({err: true, msg: "Expired token."});
        return;
      }
      // More user authentication needs to happen here.
      user = (key == decode.iss || decode.iss == req.user.email) ? true : false; // Needs to check that decode.iss == user here also.
      // If user is false then return error.
      if(!user) {
        res.status(200).json({err: true, msg: "Invalid user"});
      } else { // If it gets here then it passed validation.
        next(); // This is if the validation is successful, the user and token should match.
      }
    } catch(err) { //Only if JWT decides not to work or something.
      res.status(200).json({err: true, msg: "Invalid token."});
    }
  } else { // Failed... Just failed.
    res.status(200).json({err: true, msg: "Check token and key"});
    return;
  }
};
