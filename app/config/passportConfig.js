var FacebookStrategy = require('passport-facebook').Strategy; // Allows for Facebook validation.
var GithubStrategy   = require('passport-github').Strategy; // Allowws for Github validation.
var User             = require('./../models/User'); // User model.
var auth             = require('./auth.json'); // Super secret sauces.

// Repeated function for finding the user in the database.
var findOrCreateUser = function(profile, done) {
  User.findOne({ // Sees if user is already in DB.
    'Provider'         : profile.provider,
    'providerID'       : profile.id,
    'email'            : profile._json.email
  }, function(err, user){
    if(err){ // Return if there is an error.
      console.log(err);
      return done(err, null);
    }
    if(user){ // Return an existing user if there is one.
      return done(null, user);
    } else { // Make that new user.
      newUser = new User({
        email: profile._json.email,
        fName: profile._json.first_name,
        lName: profile._json.last_name,
        providerID: profile.id,
        accountType: false,
        nonprofitType: null,
        interests: null,
        skills: null,
        Provider: profile.provider,
        }
      );
      newUser.save(function(err) { // Save that new user.
        if(err){
          console.log(err);
        }
        return done(null, newUser);
      })
    }
  }
);
};

// Initialize with the passport instance to configure passport to run properly.
module.exports = function(passport) {

    // Used to serialize the user for the session.
    passport.serializeUser(function(user, done) {
        done(null, user); // This what will be logged into the session.
    });

    // Used to deserialize the user.
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({ // Using the facebook passport startegy to lgo people in.
        passReqToCallBack: true, // Necessary to move out that annoying function.
        clientID        : auth.facebook.clientID, // Kittens.
        clientSecret    : auth.facebook.clientSecret, // Secret sauce.
        callbackURL     : 'http://localhost:3000/oauth/facebook/login/callback', // URls
        profileFields   : ['id', 'emails', 'name'] // Permissions.
    },
      function(token, refreshToken, profile, done){ // Annoying thing that took me forever to figure out how to use.
        process.nextTick(function(){ // Async function.
          findOrCreateUser(profile, done); // That one function.
          }
        );
      }));
    // =========================================================================
    // GITHUB ==================================================================
    // =========================================================================
    passport.use(new GithubStrategy({
      passReqToCallBack: true, // This should just be default TBH... Ask if I'm salty about it.
      clientID        : auth.github.clientID, // Meerkat.
      clientSecret    : auth.github.clientSecret, // Secret sauce.
      profileFields   : ['id', 'emails', 'name'] // Permissions.
      },
      function(token, refreshToken, profile, done) { // Annoying thing that took me forever to figure out how to use.
        process.nextTick(function(){ // Async function.
          findOrCreateUser(profile, done); // That one function.
        });
      }
    ));
};
