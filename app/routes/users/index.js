const users = require('express').Router();

var Users = require('./../../models/User');

users.route('/all')
  .get((req, res) => {
    Users.find({}, function(err, users) {
      res.status(200).json(users);
    });
  });

  
users.route('/filter/:query')
  .get((req, res) => {
    Users.find({"Provider": req.params.query}, function(err, users) {
      if(err)
        res.status(200).json({err: true, msg: err});
      else
        res.status(200).json(users);
    });
  })

module.exports = users;
