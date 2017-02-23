var mongoose = require("mongoose");

// Exports schema for matches object
module.exports = mongoose.model('Mat', {
  developer : {type: mongoose.Schema.Types.ObjectId, ref: 'Users',
  nonprofit : {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  percentage: Integer
});
