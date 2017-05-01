const user = require('./../handlers/Verified_User');

module.exports = (req, res, next) => {
  req._userClass = new user(req);
  next();
}
