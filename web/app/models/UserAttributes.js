var mongoose = require("mongoose");

module.exports = mongoose.model('UserAttribute', {
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  fName            : String,
  lName            : String,
  organizationName : String,
  url              : String,
  urlNum           : Number,
  nonprofitType    : String,
  skills           : Object,
  interests        : Array,
});
