var mongoose = require('mongoose');

var Project = mongoose.Schema({
  nonprofitId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  title: String,
  description: String,
  projectType: String,
  imageUpload: Number,
  keywords: Object,
  skills: Object,
  estimatedTime: String,
  createdAt: Date
});

module.exports = mongoose.model('Project', Project);
