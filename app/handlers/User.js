'use strict'
const getUser = require('./../models/User');

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
        console.log(user);
        return done(null, user);
      } else { // Make that new user.
        newUser = new getUser({
          email: profile.email,
          fName: profile.fname,
          lName: profile.lname,
          providerID: profile.id,
          accountType: false,
          nonprofitType: null,
          interests: [],
          skills: [],
          Provider: profile.provider,
          }
        );
        newUser.save(function(err) { // Save that new user.
          if(err){
            console.log(err);
          }
          console.log(newUser);
          return done(null, newUser);
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
        var newUser = new getUser(); // Create a new user schema.
        newUser.Provider = 'local'; // Weird syntax for declaring the fields of the user.
        newUser.email = email;
        newUser.accountType = false;
        newUser.fName = req.body.fname ? req.body.fname : null;
        newUser.lName = req.body.lname ? req.body.lname : null;
        newUser.skills = [];
        newUser.interests = [];
        newUser.nonprofitType = null;
        newUser.providerID = null;
        newUser.password = newUser.generateHash(password); // This is why the weird syntax seems necessary.

        newUser.save(function(err){ // Save the user.
          if(err)
            throw err;
          return done(null, newUser);
        });
      }
    });
  }

  passportLogInCurrentUser(email, password, done) {
    getUser.findOne({'email': email,'Provider' : 'local'}, function(err, user) { // Finding the user.
      if(err)
        throw new err;
      if(!user){ // Makes sure the user exists.
        return done(null, false);
      }
      if(user.Provider != 'local') // Make sure the email comes from a local user.
        return done(null, false);
      if(!user.validPassword(password)) // Validate password.
        return done(null, false);

      return done(null, user); // Return the user.
    });
  }
}

module.exports = User;
