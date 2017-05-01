'use strict'

const userClass = require('./User');
const getUser   = require('./../models/User');
const userAttr  = require('./../models/UserAttributes');

class signedUser extends userClass {


  constructor(req) {
    // Checks for the req object.
    if(!req) {
      console.log('Verified_User class requires the req object.');
      return;
    }
    // Ensures the user is logged in before moving on.
    super();
    if(!req.isAuthenticated()) {
      this.isLoggedIn       = false;
      return;
    }
    // Sets the user values that are already stored in the session.
    this.isLoggedIn       = true;
    this.dbUser           = false;
    this.user._id         = req.user._id;
    this.user.email       = req.user.email;
    this.user.Provider    = req.user.Provider;
    this.user.providerID  = req.user.providerID;
    this.user.accountType = req.user.accountType;
    this.limits           = [];
  }

  // Limits what can be altered to ensure that fields cannot be changed without permission.
  attachLimit(limit) {
    return new Promise((resolve, reject) => {
        if(typeof limit === 'string') {
          if((this.user[limit] !== undefined || this.attr[limit] !== undefined) && this.limits.indexOf(limit) === -1) {
            this.limits.push(limit);
            resolve(true);
          }
        Promise.reject(new Error(limit+' is not a value to be limited.'))
      } else if(typeof limit === 'object' && Object.prototype.toString.call(limit) === '[object Array]') {
        limit.forEach((val) => {
          if(this.user[val] !== undefined || this.attr[val] !== undefined) {
            this.limits.push(val);
          } else {
            console.log('%s is not a key', val);
          }
        });
        resolve(true);
      } else {
        console.log('%s is not supported', (typeof limit === 'object') ? Object.prototype.toString.call(limit) : typeof limit);
        Promise.reject(new Error('Unsupported data type given to attach limit. Supports arrays and strings only'));
      }

    })
  }
  // Inserts the values from the user table.
  populateUser() {
    return new Promise((resolve, reject) => {
      getUser.find({_id: this.user._id}, (err, user) => {
        if(err || user.length !== 1) {
          let msg = (err) ? err : user.length+' users exist with the U.I.D: '+this.user._id+', there should only be one!'
          Promise.reject(new Error(msg));
        }
        this.user = user[0];
        this.dbUser = true;
        resolve();
      });
    });
  }

  // Inserts the userAttributes values for the logged in user.
  populateAttributes() {
    return new Promise((resolve, reject) => {
      userAttr.find({userId: this.user._id}, (err, users) => {

        // Errors.
        if(err) {
          console.log(err);
          return;
        }
        if(users.length !== 1) {
          console.log('%d users exist with the U.I.D: %s, there should only be one!', users.length, this.user._id);
          return;
        }
        this.attr = users[0];
        resolve();

      });
    });
  }

  // Updates the user and userAttributes tables accordingly.
  //    *Note: Must call populateUser before hand if you plan to alter a value in the user table.
  updateUser(values) {
    return new Promise((resolve, reject) => {
      if(values === null) {
        this.attr.save();
        if(this.dbUser)
          this.user.save();
      } else if(typeof values === 'object' && Object.prototype.toString.call(values) === '[object Object]') {
        for(let key in values) {
          console.log(key);
          loopThrough(this.limits, this.attr, values, key);
        }
        if(this.dbUser === true) {
          for(let key in values) {
            console.log(key);
            loopThrough(this.limits, this.user, values, key);
          }
          this.user.save();
        }
        this.attr.save();
      }
      resolve();
    });
  }
}

const loopThrough = function(limits, values, value, key) {
  if(limits.indexOf(key) === -1 && values[key] !== undefined && values[key] !== value[key]) {
    values.markModified(key);
    values[key] = value[key];
  }
}


// let h = new signedUser({user: {_id: '58b625c88bb734161699c44c', email: 'as', accountType: false, Provider: 'local', providerID: null}, isAuthenticated: () => {return true;}});
// h.populateAttributes().then(() => {
//   h.populateUser().then(() => {
//     h.attachLimit(['fName', 'email']).then(() => {
//       h.updateUser({fName: 'Cooper', email: 'fake@fake.com'}).then(() => {
//         console.log(h);
//       });
//     });
//   });
// });

module.exports = signedUser;
