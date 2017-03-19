const projects = require('express').Router();
var Project = require('./../../models/Project');

projects.route('/')
  .get((req, res) => {
    Project.find({}, function(err, projects){
      res.status(200).json(projects);
    });
  })

  .post((req, res) => {
    var newProject = new Project({
      'nonprofitID': req.body.nonprofitID,
      'title': req.body.title,
      'description': req.body.description,
      'projectType': req.body.projectType,
      'imageUpload': req.body.imageUpload,
      'keywords': req.body.keywords,
      'skills': req.body.skills,
      'estimatedTime': req.body.estimatedTime,
      'createdAt': Date()
    });

    newProject.save((req, data) => {
      if(err) throw err;

      console.log("Saved: " + JSON.stringify(data));
    });
  });


projects.route('/:id')
  .get((req, res) => {
    var id = req.param.id;
    User.findById(id, function(err, project){
      res.status(200).json(project);
    });
  })

  .put((req, res) => {
    Project.findById(req.params.id, function(err, project) {
      if(err)
        res.status(500).json({"error" : "Could not update"});

        project.nonprofitID = req.body.nonprofitID,
        project.title = req.body.title,
        project.description = req.body.description,
        project.projectType = req.body.projectType,
        project.imageUpload = req.body.imageUpload,
        project.keywords = req.body.keywords,
        project.skills = req.body.skills,
        project.estimatedTime = req.body.estimatedTime,
        project.createdAt = Date()

        res.status(200).json({"message": "Updated Succesfully"});
    });
  })

  .delete((req, res) => {
    Greeting.remove({_id: req.body.id}, function(err){
      if(!err)
        res.status(404).json({"error": "No greetings for the language yet"});

      res.status(200).json({"message" : "Deleted Succesfully"});
    });
  });


module.exports = projects;
