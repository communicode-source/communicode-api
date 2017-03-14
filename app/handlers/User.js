'use strict'
const getUser = require('./../models/User');
const userAttr = require('./../models/UserAttributes');
const mongoose = require('mongoose');
/**
* This should be used for any interaction with the User or UserAttributes collections.
* Usage:
*   Constructor: When constructing the User, add the request object if you plan on doing anything with the logged in user.
*     @param req: optional.
*   returnAll: A literal dump of all users(without attibutes) in the database.
*     @param call: function(err, users).
*   getUrl: Returns user attributes where the url == the passed in url.
*     @param url: url for searching, required, fname.lname.#; call: function(err, users), required;
*   getProfile: Takes in user ID, returns JSON of {user: Object, attributes: Object}
*     @param id: user Id to search for, required; call: function(err, user), required.
*   updateData: Used for updating the user AND the user attibutes in one function. Longest method so maybe try to avoid.
*     @param
*       id: user Id to search for, required;
*       req: the request object to get the data for updating, required;
*       functions: array, functions to call for each of [0] : user fields, [1] : attribute fields. Non-function options are string and array, required;
*          EX. [{email: 'string'}, {lName: function(user, value, key) = {...}}]
*       call: function(err, updatedData), required;
*     ** Note: url is updated in the background and may take a while for this method.
*   getSessUser: returns a parameter of the logged in user.
*     @param param: specific value to return, if null returns all signed in data values, optional.
*   isSignedIn: returns true or false based on whether or not a user exists.
*     @param none.
*   findUsers: finds users based off of any payload, returns an array of user objects. No attributes.
*     @param payload: JSON to search by in the database. call: function(err, users), required.
*   Passport functions: Used with signing in or up users, don't call these por favor.
**/
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
    getUser.findById(id, function(err, user) {
      let error = null;
      if(err){
        error = [err];
      }
      userAttr.findOne({"userId": user._id}, function(errTwo, attr){
        if(errTwo){
          error[1] = errTwo;
        }
        call(error, {"user" : user, "attributes": attr});
      });
    });
  }

  updateData(id, req, functions, call) {
    let modified = {};
    if(!this.isLoggedIn) {
      call('No logged in user');
    }
    // User first.
    getUser.findOne({'_id': id}, function(err, user) {
      if(err) {
        call(err);
      }
      makeChanges(user, functions[0], req.body, modified)

      user.save();
    });
    // Attributes now
    userAttr.findOne({'userId': id}, function(err, attr) {
      if(err){
        call(err);
      }
      makeChanges(attr, functions[1], req.body, modified);
      // Checks for a name change, and that the URL has not been manually altered.
      if((modified.fName || modified.lName) && !modified.url) {
        process.nextTick(()=>{updateUrl(attr);});
        modified['url'] = null;
      } else {
        attr.save();
      }
      call(null, modified);
    });

  }

  getSessUser(param) {
      if(param) {
        return (this.user) ? this.user[param] : 'No signed in user';
      }
      return (this.user) ? this.user : 'No signed in user';
  }

  isSignedIn() {
    return this.isLoggedIn;
  }

  findUsers(payload, call) {
    getUser.find(payload, function(err, users) {
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
    }, function(err, user) {
      if(err){ // Return if there is an error.
        return done(err, null);
      }
      if(user) { // Return an existing user if there is one.
        return done(null, user);
      } else { // Make that new user.
          let newUser = new getUser({
          email: profile.email,
          providerID: profile.id,
          accountType: false,
          Provider: profile.provider,
          }
        );
        newUser.save();
        let hID = newUser._id;
        let userA = new userAttr({
          fName: profile.fname,
          lName: profile.lname,
          userId: hID,
          url: null,
          interests: [],
          skills : []
        });
        process.nextTick(()=>{updateUrl(userA);});
        return done(null, newUser);
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
        let newUser = new getUser();
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
        let hID = newUser._id;
        let userA = new userAttr({
          fName: null,
          lName: null,
          userId: hID,
          url: null,
          interests: [],
          skills: []
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
// PRIVATE FUNCTIONS =======================================================================
const updateUrl = function(attr) {
  let urlBase = attr.fName.toLowerCase()+'.'+attr.lName.toLowerCase(); // Base of the URL.
  let reg = new RegExp("^"+urlBase+"[0-9]*$"); // Regex used for matching.
  userAttr.find({url: {$regex: reg, $options: 'i'}}, null, {sort: {url: 1}}, function(err, matches) {
    if(!matches){
      return;
    }
    let length = matches.length; // Increase the count of that url by one for this user.
    const userUrl = getUrlNumber(matches, length-1);
    length = length + 1;
    attr.url = urlBase+userUrl.toString();
    attr.markModified('url');
    attr.save();
  });
}
// Allows for a string to be updated in the database without explicitly defining this a million times.
const defaultStringUpdate = (user, val, key) => {
  if(user[key] != val){
    user[key] = val;
    user.markModified(key);
    return true;
  }
  return false;
};
// Allows for an array to be updated in the database without explicitly defining this a million times.
const defaultArrayUpdate = (user, val, key) => {
  if(!user[key].includes(val)) {
    user[key].push(val);
    user.markModified(key);
    return true;
  }
  return false;
};
// Just a repeated function.
const makeChanges = (dbVal, direction, input, tracker) => {
  // Loop through the values marked for change.
  for(let key in direction) {
    // Make sure there is data from the page.
    if(!input[key]) {
      continue;
    }
    // Call the designated function as defined when calling.
    if(typeof direction[key] == 'function') {
      if(functions[0][key](dbVal, input[key], key) === true) {
        tracker[key] = input[key];
      }
    } else {
      switch(direction[key]) {
        case 'string':
          if(defaultStringUpdate(dbVal, input[key], key) === true) {
            tracker[key] = input[key];
          }
          break;
        case 'array':
          if(defaultArrayUpdate(dbVal, input[key], key) === true) {
            tracker[key] = input[key];
          }
          break;
      }
    }

  }
}

const getUrlNumber = (set, length) => {
  if(length === -1) {
    return 1;
  }
  let cor = 0;
  let inc = length;
  let userNum = getMatch(set, length);
  let iterator = 0;
  // All is well.
  if(userNum == (length+1)) {
    return (+userNum + 1);
  }
  if(getMatch(set, 0) != 1) {
    return +1;
  }
  length = Math.floor(newLength(cor, inc));
  // Half way point
  while(cor + 1 != inc || iterator > 30) {
    iterator++;
    // Issues here
    userNum = getMatch(set, length);
    if(userNum == length + 1) {
      cor = length;
    } else {
      inc = length;
    }
    length = Math.floor(newLength(cor, inc));
  }
  console.log(iterator);
  return (+getMatch(set, cor) + 1);
}
const newLength = (cor, inc) => ((cor + inc)/2);
const getMatch = (set, length) => set[length].url.match(/[0-9]*$/)[0];
