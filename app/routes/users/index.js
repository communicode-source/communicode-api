const users = require('express').Router();
const User = require('./../../handlers/User');

users.route('/all')
  .get((req, res) => {
    // returnAll(call)
    new User(req).returnAll(function(err, users) {
      if(err)
        res.status(200).json({err: true, msg: err});
      else
        res.status(200).json(users);
    })
  });


users.route('/filter/:query')
  .get((req, res) => {
    var callback = function(err, users) {
      for(var key in users) {
        users[key].password = null;
        users[key]._id = null;
        users[key].providerID = null;
      }
      if(err)
        res.status(200).json({err: true, msg: err});
      else
        res.status(200).json(users);
    };
    new User().findUsers({"email": req.params.query}, callback);
  });

users.route('/update')
  .get((req, res) => {
    const uVal = new User(req);
    const callback =  function(err, users) {
      if(err)
        res.status(200).json({err: true, msg: 'Something went wrong'});
      if(users.length > 1){
        res.status(200).json({err: true, msg: 'Something went wrong'});
        return;
      }
      user = users[0];
      var userProfile = {
        "fname" : (user.fName) ? user.fName : false,
        "lname" : (user.lName) ? user.lName : false,
        "email" : (user.email) ? user.email : false,
        "interests":(user.interests) ? user.interests : false
      };
      setTimeout((function() {res.status(200).json(userProfile);}), 0);
    };
    uVal.findUsers({'Provider': uVal.getSessUser('Provider'), 'email': uVal.getSessUser('email')}, callback);
  })
  .post((req, res) => {
    const uVal = new User(req);
    const callback = function(err, users) {
      if(err)
        res.status(200).json({err: true, msg: 'Something went wrong, try again later'});
      if(users.length > 1){
        res.status(200).json({err: true, msg: 'Something went wrong, try again laters'});
        return;
      }
      var user = users[0];
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
    };
    uVal.findUsers({'Provider': uVal.getSessUser('Provider'), 'email': uVal.getSessUser('email')}, callback);
  });
users.route('/me')
  .get((req, res) => {
    var t = new User(req);
    t.findUsers({"email": t.getSessUser('email'), "Provider": t.getSessUser('Provider')}, function(err, users) {
      if(err){
        res.status(200).json({err: true, msg: err});
        return;
      }
      if(users.length > 1){
        res.status(200).json({err: true, msg: 'Too many users'});
        return;
      }
      var user = users[0];
      user.password = null;
      user._id = null;
      user.providerID = null;
      res.status(200).json(user);
    });
  })
  users.route('/fake')
  .get((req, res) => {
      var t = new User(req);
      t.updateData(t.getSessUser('Provider'), t.getSessUser('email'), function(err, data){
        if(err){
          console.log("error %s", err);
          res.send('There was an internal error, sorry');
          return;
        }
        res.json(data);
      });
  });


module.exports = users;
