var mongoose = require("mongoose");

module.exports = mongoose.model('Greeting', {
  language: String,
  greeting: String
});
