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
    if(!req.isAuthenticated()) {
      return;
    }
    super();
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

  attachLimit(limit) {
    return new Promise((resolve, reject) => {
        if(typeof limit === 'string') {
        if(this.user[limit] !== undefined || this.attr[limit] !== undefined) {
          this.limits.push(limit);
          resolve(true);
        }

        resolve(false);
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
      }
      resolve(null);

    })
  }

  populateUser() {
    return new Promise((resolve, reject) => {
      getUser.find({_id: this.user._id}, (err, user) => {
        if(err) {
          console.log(err);
          return;
        }
        if(user.length !== 1) {
          console.log('%d users exist with the U.I.D: %s, there should only be one!', user.length, this.user._id);
          return;
        }

        this.user = user[0];
        this.dbUser = true;
        resolve();
      });
    });
  }

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

  updateUser(values) {
    return new Promise((resolve, reject) => {
      if(values === null){
        this.attr.save();
        if(this.dbUser)
          this.user.save();
      } else if(typeof values === 'object' && Object.prototype.toString.call(values) === '[object Object]') {
        for(let key in values) {
          this.attr.markModified('fName');
          loopThrough(this.limits, this.attr, values, key);
        }
        if(this.dbUser === true) {
          for(let key in values) {
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
let h = new signedUser({user: {_id: '58b625c88bb734161699c44c', email: 'as', accountType: false, Provider: 'local', providerID: null}, isAuthenticated: () => {return true;}});


const loopThrough = function(limits, values, value, key) {
  if(limits.indexOf(key) === -1 && values[key] !== undefined) {
    console.log(key);
    values.markModified(key);
    values[key] = value[key];
  }
}

h.populateAttributes().then(() => {
  h.populateUser().then(() => {
    h.attachLimit(['email']).then(() => {
      h.updateUser({fName: 'Cooper', email: 'fake@fake.com'}).then(() => {
        console.log(h);
      });
    });
  });
});

// h.attachLimit(['email', 'fName']).then(h.populateAttributes().then(h.populateUser().then(() => {
//   h.updateUser({fName: 'Nwton', lName: 'Newt', email: 'mwahaaha'}).then(() => {
//     console.log(h);
//   }, (err) => {console.log(err);});
//
// })));


//  new Date().getTime()
// { _id: 58ced31d606877123d94add1,
//      fName: 'Newton',
//      lName: 'Newt',
//      userId: 58ced31d606877123d94add0,
//      url: 'newton.newt1',
//      skills: [],
//      __v: 0,
//      interests: [] }

// { _id: 58b625c88bb734161699c44d,
//      fName: 'Cooper',
//      lName: 'Campbell',
//      userId: 58b625c88bb734161699c44c,
//      url: 'cooper.campbell5',
//      __v: 1,
//      skills: [],
//      interests: [ 'none' ] }
module.exports = signedUser;
