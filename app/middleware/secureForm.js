var sanitizer  = require('sanitizer');

module.exports = function( req, res, next ) {
  req.body.sanatized = {};
  req.params.sanatized = {};
  for(var key in req.body) {
    if(key == "sanatized")
      continue;
    req.body.sanatized[key] = sanitizer.escape(req.body[key]);
  };
  for(var key in req.params) {
    if(key == "sanatized")
      continue;
    req.params.sanatized[key] = sanitizer.escape(req.params[key]);
  };
  next();
}
