const users = require('express').Router();
var Users   = require('./../../models/User');

users.route('/all')
  .get((req, res) => {
    Users.find({}, function(err, users) {
      res.status(200).json(users);
    });
  });


users.route('/filter/:query')
  .get((req, res) => {
    Users.find({"email": req.params.query}, function(err, users) {
      for(var key in users) {
        users[key].password = null;
        users[key]._id = null;
        users[key].providerID = null;
      }
      if(err)
        res.status(200).json({err: true, msg: err});
      else
        res.status(200).json(users);
    });
  });

users.route('/update')
  .get((req, res) => {
      Users.findOne({'Provider': req.user.Provider, 'email': req.user.email}, function(err, user) {
        if(err)
          res.status(200).json({err: true, msg: 'Something went wrong'});
        var userProfile = {
          "fname" : (user.fName) ? user.fName : false,
          "lname" : (user.lName) ? user.lName : false,
          "email" : (user.email) ? user.email : false,
          "interests":(user.interests) ? user.interests : false
        };
        setTimeout((function() {res.status(200).json(userProfile);}), 0);
      });
  })
  .post((req, res) => {
    Users.findOne({'Provider': req.user.Provider, 'email': req.user.email}, function(err, user) {
      if(err)
        res.status(200).json({err: true, msg: 'Something went wrong, try again later'});
      var updateData = {msg: ""};
      const blacklist = {email: "Sorry, email could not be updated at this time. "};
      for(var key in req.body.sanatized){
        if(blacklist[key] && req.body[key] != user[key] && req.body[key] != "" && req.body[key] != false){
          updateData.msg += blacklist[key];
          updateData.err = true;
          updateData[key] = false;
          continue;
        } else if(blacklist[key]) {
          updateData[key] = false;
          continue;
        }
        if(req.body[key] != user[key] && req.body[key] != "" && req.body[key] != false){
          updateData[key] = req.body.sanatized[key];
          if(key == "interests" && user[key] != null){
            if(user[key].indexOf(req.body.sanatized[key]) != -1){
              updateData[key] = false;
            } else {
              user[key].push(req.body.sanatized[key]);
              user.markModified(key);
            }
            continue;
          }
          user[key] = req.body.sanatized[key];
        } else {
          updateData[key] = false;
        }
      }
      user.save();
      setTimeout((function() {res.status(200).json(updateData);}), 0);
    });

  });

users.route('/update/:id/name')

  .put((req, res) => {
    User.findById(req.params.id, function(err, user) {
      if(err)
        res.status(500).json({"error": "Could not update"});

      user.fname = req.body.fname;
      user.lname = req.body.lname;
      user.save();
      res.status(200).json({"message": "Updated successfully"});
    });
  });

users.route('/me')
  .get((req, res) => {
    Users.findOne({"email": req.user.email}, function(err, user) {
      if(err){
        res.status(200).json({err: true, msg: err});
        return;
      }
      user.password = null;
      user._id = null;
      user.providerID = null;
      res.status(200).json(user);
    });
  })


module.exports = users;
