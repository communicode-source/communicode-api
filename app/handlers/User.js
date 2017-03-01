'use strict'
const getUser = require('./../models/User');
const userAttr = require('./../models/UserAttributes');
const mongoose = require('mongoose');
class User {
  constructor(req) {
    this.isLoggedIn = (req) ? (req.isAuthenticated()) ? true : false : false;
    this.user = (req) ? (req.user) ? req.user : false : false;
  }

  returnAll(call) {
    getUser.find({}, function(err, users){
      call(err, users)
    });
  }

  getUrl(url, call) {
    userAttr.find({"url": url}, function(err, users){
      call(err, users);
    });
  }

  getProfile(id, call) {
    getUser.findOne({"_id": id}, function(err, user) {
      var error = null;
      if(err){
        error = [err];
      }
      userAttr.findOne({"userId": user._id}, function(errTwo, attr){
        if(errTwo){
          error[1] = errTwo;
        }
        var profile = user;
        profile.attr = [];
        for(var key in attr) {
          console.log(attr[key]);
          profile.attr[key] = attr[key];
        }
        call({"user" : profile, "attributes": attr});
      });
    });
  }

  updateData(provider, email, call) {
    if(!this.isLoggedIn){
      call("Not logged in");
      return;
    } else {
      getUser.find({"Provider" : provider, "email" : email}, function(err, user){
        if(!user){
          call("invalid user");
          return;
        }
        if(user.length > 1) {
          call("We got a big problem... %s identical entries %s, at %s", user.length, user[0].email, user[0].Provider);
          return;
        }
        call(err, user[0]);
      });
      }
    }

  getSessUser(param) {
      if(param){
        return (this.user) ? this.user[param] : 'No signed in user';
      }
      return (this.user) ? this.user : 'No signed in user';
  }

  isSignedIn() {
    return this.isLoggedIn;
  }

  updateUser(user, newValues, call) {
    getUser.update({"Provider" : user.provider, "providerID" : user.provderId, "email" : user.email}, {$set: newValues}, function(err, user) {
      call(err, user);
    });
  }

  findUsers(id, call) {
    getUser.find(id, function(err, users){
      call(err, users);
    });
  }

  //==============================================================================
  // Passport Functions. =========================================================
  //==============================================================================
  passportFindOrCreate(profile, done) {
    getUser.findOne({ // Sees if user is already in DB.
      'Provider'         : profile.provider,
      'providerID'       : profile.id,
      'email'            : profile.email
    }, function(err, user){
      if(err){ // Return if there is an error.
        console.log(err);
        return done(err, null);
      }
      if(user){ // Return an existing user if there is one.
        return done(null, user);
      } else { // Make that new user.
          var newUser = new getUser({
          email: profile.email,
          providerID: profile.id,
          accountType: false,
          Provider: profile.provider,
          }
        );
        newUser.save(function(err) { // Save that new user.
          if(err){
            console.log(err);
          }
        });
        var reg = new RegExp(profile.fname.toLowerCase()+'.'+profile.lname.toLowerCase());
        userAttr.find({url: {$regex: reg, $options: 'i'} }, function(err, res) {
          console.log(res+"lsdkfjsdlkfj");
          console.log(res.length);
          var len = res.length+1;
          console.log(len);
          var hID = newUser._id;
          var userA = new userAttr({
            fName: profile.fname,
            lName: profile.lname,
            userId: hID,
            url: profile.fname.toLowerCase()+'.'+profile.lname.toLowerCase()+len.toString()
          });
          userA.save(function(err) {
            if(err){
              console.log(err)
            }
            return done(null, newUser);
          });
        });
      }
    });
  }

  passportCreateLocalUser(req, email, password, done) {
    getUser.findOne({'email': email, 'Provider' : 'local'}, function(err, user) {
      if(err)
        return done(err);
      if(user) {
        return done(null, false);
      } else {
        var newUser = new getUser();
        newUser.Provider = 'local';
        newUser.email = email;
        newUser.accountType = false;
        newUser.providerID = null;
        newUser.password = newUser.generateHash(password);
        newUser.save(function(err){ 
          if(err)
            throw err;
          return done(null, newUser);
        });
        var hID = newUser._id;
        var userA = new userAttr({
          fName: null,
          lName: null,
          userId: hID,
          url: null
        });
        userA.save(function(err) {
          if(err){
            console.log(err)
          }
          return done(null, newUser);
        });
      }
    });
  }

  passportLogInCurrentUser(email, password, done) {
    getUser.findOne({'email': email, 'Provider' : 'local'}, function(err, user) { // Finding the user.
      if(err)
        throw new err;
      if(!user){ // Makes sure the user exists.
        return done(null, false);
      }
      if(!user.validPassword(password)) // Validate password.
        return done(null, false);

      return done(null, user); // Return the user.
    });
  }
}

module.exports = User;
