
var mongoose = require("mongoose");

// Exports schema for matches object
module.exports = mongoose.model('Match', {
  developer : {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  nonprofit : {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  percentage: String
});
