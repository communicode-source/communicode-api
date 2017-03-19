const users = require('express').Router();
const UserHandler = require('./../../handlers/User');
const User = require('./../../models/User');

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
    var callback = function(err, set) {
      for(let key in set.users) {
        set.user[key].password = null;
        set.user[key]._id = null;
        set.user[key].providerID = null;
      }
      if(err)
        res.status(200).json({err: true, msg: err});
      else
        res.status(200).json(set);
    };
    new User().findUsers({email: req.params.query}, callback);
  });

users.route('/update')
  .get((req, res) => {
    const uVal = new User(req);
    const callback =  function(err, set) {
      if(err) {
        res.status(200).json({err: true, msg: 'Something went wrong'});
        return;
      }
      const user = set.user;
      const attr = set.attributes;
      var userProfile = {
        "fname" : (attr.fName) ? attr.fName : false,
        "lname" : (attr.lName) ? attr.lName : false,
        "email" : (user.email) ? user.email : false,
        "interests":(user.interests) ? attr.interests : false
      };
      res.status(200).json(userProfile);
    };
    uVal.getProfile(uVal.getSessUser('_id'), callback);
  })
  .post((req, res) => {
    const uVal = new User(req);
    const callback = function(err, updateData) {
      if(err)
        res.status(200).json({err: true, msg: 'Something went wrong, try again later'});
      res.status(200).json(updateData);
    };
    const attrV = {
      fName: 'string',
      lName: 'string',
      interests: 'array',
      skills: 'array'
    };
    const userVa = {};
    uVal.updateData(uVal.getSessUser('_id'), req, [userVa, attrV], callback);
  });

users.route('/me')
  .get((req, res) => {
    var t = new UserHandler(req);
    t.getProfile(t.getSessUser('_id'), function(err, set) {
      if(err){
        res.status(200).json({err: true, msg: err});
        return;
      }
      set.user.password = null;
      set.user.providerID = null;
      res.status(200).json(set);
    });
  })
  users.route('/fake')
  .get((req, res) => {
      var t = new UserHandler(req);
      t.updateData(t.getSessUser('_id'), function(err, data){
        if(err){
          console.log("error %s", err);
          res.send('There was an internal error, sorry');
          return;
        }
        res.json(data);
      });
  });
users.route('/ff')
  .get((req, res) => {
    var t = new UserHandler();
    res.send(t.ff().toString());
  });

module.exports = users;
