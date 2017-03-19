// Refer to ../../server.js
var mongoose = require("mongoose");

// Export the schema for the "Greeting" object.
module.exports = mongoose.model('Greeting', {
  language: String,
  greeting: String
});
