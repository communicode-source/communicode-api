'use strict'
const projects = require('./../models/Project');


class Project {
  constructor(data) {
    this.data = (data) ? data : null;
  }

  getProject(id, call) {
    projects.findById(id, function(err, project) {
      call(err, project);
    });
  }

  makeProject() {
    let n = new projects();
    n.nonprofitId = data.id;
    n.title = data.title;
    n.description = data.description;
    n.projectType = data.projectType;
    n.imageUpload = data.imageUpload;
    n.keywords = data.keywords;
    n.skills = data.skills;
    n.estimatedTime = data.estimatedTime;
    n.createdAt = data.createdAt;

    n.save();
  }

}
