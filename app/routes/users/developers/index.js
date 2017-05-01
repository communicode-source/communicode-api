const users = require('express').Router();

const UserHandler = require('./../../../handlers/User');
const User        = require('./../../../models/User');

users.route('/')

  .get((req, res) => {
    User.find({accountType: 0}, (err, developers) => {
      if(err)
        res.status(404).json({message: "An error occurred"});

      res.status(200).json(developers);
    });
  });

users.route('/:id')

  .get((req, res) => {
    User.find({_id: req.params.id, accountType: 0}, (err, developer) => {
      if(err)
        res.status(404).json({message: "An error occurred"});

      res.status(200).json(developer);
    });
  });

users.route('/:id/name')

  .get((req, res) => {
    res.status(200).json({message: "I exist"});
  })

  .put((req, res) => {
    User.findById(req.params.id, function(err, user) {
      if(err)
        res.json({"error": err});

      Developer = req._userClass;

      Developer.updateNameAndUrl({
        fName: req.body.sanitized.fname,
        lName: req.body.sanitized.lname
      }, user._id, function(err, result) {
        if(err)
          res.json({error: err});

        res.json({message: result});
      });
    });
  });

users.route('/:id/interests')

  .put((req, res) => {
    User.findById(req.params.id, function(err, user) {
      if(err)
        res.json({"error": err});

      Developer = req._userClass;

      Developer.updateUserAttribute({
        interests: req.body.sanitized.interests.split(",")
      }, user._id, function(err, result) {
        if(err)
          res.json({error: err});

        res.json({
          data: {
            message: "Successfully Updates",
            url: result.url
          }
        });
      });
    });
  });


module.exports = users;
