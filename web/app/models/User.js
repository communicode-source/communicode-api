// Refer to ../../server.js
var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');
// Export the schema for the "Greeting" object.
var User = mongoose.Schema({
  email:             String,
  accountType:       Boolean,
  Provider:          String,
  providerID:        String,
  password:          String
});
User.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', User);
