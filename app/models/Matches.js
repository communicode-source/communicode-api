// Refer to ../../server.js
//Again referencing the "Greetings" model, not sure if correct, but if it is wrong feel free to delete. Still learning.
var mongoose = require("mongoose");

// Export the schema for the "Matches" object.
module.exports = mongoose.model('Matches', {
    developer: {type: mongoose.schema.Types.Objectld, ref: 'Users'},
    nonprofit: {type: mongoose.schema.Types.Objectld, ref: 'Users'},
    percentage: String
});
