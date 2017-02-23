var mongoose = require("mongoose");

// Exports schema for matches object
module.exports = mongoose.model('Matches', {
  developer : {type: mongoose.Schema.Types.ObjectId, ref: 'Users',
  nonprofit : {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  percentage: Integer
});
