const users = require('express').Router();

const UserHandler = require('./../../../handlers/User');
const User        = require('./../../../models/User');

users.route('/')

  .get((req, res) => {
    User.find({accountType: 1}, (err, nonprofits) => {
      if(err)
        res.status(404).json({message: "An error occurred"});

      res.status(200).json(nonprofits);
    });
  });

users.route('/:id')

  .get((req, res) => {
    User.find({_id: req.params.id, accountType: 1}, (err, nonprofit) => {
      if(err)
        res.status(404).json({message: "An error occurred"});

      res.status(200).json(nonprofit);
    });
  });

users.route('/:id/name')

  .put((req, res) => {
    User.findById(req.params.id, function(err, user) {
      if(err)
        res.json({"error": err});

      Nonprofit = new UserHandler(req);

      Nonprofit.updateOrganizationAndUrl({
        organizationName: req.body.sanitized.organizationName
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

      Nonprofit = new UserHandler(req);

      Nonprofit.updateUserAttribute({
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
