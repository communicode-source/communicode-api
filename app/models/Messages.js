//A mongoose schema and model for messages

var mongoose = require('mongoose'); //grab mongoose
module.export = new mongoose.model('Message', { //assign to module.export (allows outside access), create a new model with a new schema inside holding the data
  to: { type:mongoose.Schema.Types.ObjectId, ref: 'Users' }, // syntax for mongoose Schema is name: Data type , {inside} for more tags and with each term separated by a comma
  from:{ type:mongoose.Schema.Types.ObjectId, ref: 'Users'},
  message: String,
  time: String
})
