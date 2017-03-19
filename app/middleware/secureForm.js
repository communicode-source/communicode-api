var sanitizer  = require('sanitizer');

module.exports = function( req, res, next ) {
  req.body.sanitized = {};
  req.params.sanitized = {};
  for(var key in req.body) {
    if(key == "sanitized")
      continue;
    req.body.sanitized[key] = sanitizer.escape(req.body[key]);
  };
  for(var key in req.params) {
    if(key == "sanitized")
      continue;
    req.params.sanitized[key] = sanitizer.escape(req.params[key]);
  };
  next();
}
