const FacebookStrategy  = require('passport-facebook').Strategy; // Allows for Facebook validation.
const GithubStrategy    = require('passport-github').Strategy; // Allowws for Github validation.
const LocalStrategy     = require('passport-local').Strategy; // Allows for custom local validation.
const auth              = require('./auth.json'); // Super secret sauces.
var User                = require('./../models/User'); // User model.
const newUserEmail      = require('./../middleware/email').newUserEmail;
const token             = require('./../middleware/genToken').returnKeytoken;

// Repeated function for finding the user in the database.
const findOrCreateUser = function(profile, done) {
  User.findOne({ // Sees if user is already in DB.
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
      newUser = new User({
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
// Function to create a user in the local database.
const createLocalUser = function(req, email, password, done) {
  User.findOne({'email': email}, function(err, user) {
    if(err)
      return done(err);
    if(user) {
      return done(null, false);
    } else {
      var newUser = new User(); // Create a new user schema.
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
// Function to log in the current user in the lcoal database.
const logInCurrentUser = function(email, password, done) {
  User.findOne({'email': email}, function(err, user) { // Finding the user.
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

// Initialize with the passport instance to configure passport to run properly.
module.exports = function(passport) {

    // Used to serialize the user for the session.
    passport.serializeUser(function(user, done) {
        done(null, user); // This what will be logged into the session.
    });

    // Used to deserialize the user.
    passport.deserializeUser(function(user, done) {
        done(null, user); // This is what will be unlogged.
    });

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({ // Using the facebook passport startegy to lgo people in.
        clientID        : auth.facebook.clientID, // Kittens.
        clientSecret    : auth.facebook.clientSecret, // Secret sauce.
        callbackURL     : 'http://localhost:3000/oauth/facebook/login/callback', // URls
        profileFields   : ['id', 'emails', 'name'] // Permissions.
    },
      function(token, refreshToken, profile, done){ // Annoying thing that took me forever to figure out how to use.
        process.nextTick(function(){ // Async function.
          var user = {
            "fname": profile._json.first_name,
            "lname": profile._json.last_name,
            "provider": "facebook",
            "id": profile.id,
            "email": profile._json.email
          }
          findOrCreateUser(user, done); // That one function.
          }
        );
      }));
    // =========================================================================
    // GITHUB ==================================================================
    // =========================================================================
    passport.use(new GithubStrategy({
      clientID        : auth.github.clientID, // Meerkat.
      clientSecret    : auth.github.clientSecret, // Secret sauce.
      profileFields   : ['id', 'emails', 'name'] // Permissions.
      },
      function(token, refreshToken, profile, done) { // Annoying thing that took me forever to figure out how to use.
        process.nextTick(function(){ // Async function.
          var user = {
            "fname": profile._json.name.split(" ")[0],
            "lname": profile._json.name.split(" ")[profile._json.name.split(" ").length - 1],
            "provider": "github",
            "id": profile.id,
            "email": profile._json.email
          }
          findOrCreateUser(user, done); // That one function.
        });
      }
    ));

    // =========================================================================
    // LOCAL REGISTRATION ======================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
      usernameField: 'email', // Changes the default from 'username' to 'email.'
      /**
      *
      * THIS IS THE DUMBEST THING EVER. SINCE WHEN DID HAVING A SPACE AFTER THE KEY
      *      TO A JSON OBJECT ACTUALLY AFFECT THE GOSH DANG VALUE. JAVASCRIPT IS NOT
      *      A FLIPPING WHITE SPACE LANGUAGE. THIS SHOULD NOT BE A PROBLEM. WHY DO
      *      OTHER THINGS WORK FINE WITHOUT THE SPACE? HOW DO YOU EVEN ACCOMPLISH
      *      MAKING SUCH A THING ILLEGAL WHEN IT REALLY ISN'T?!?!?! CRAP.
      *             -- Cooper <(2/10/17)
      *
      **/
      passReqToCallback: true // AWFUL. RUN. AS FAR AWAY AS YOU CAN. 0/10. NEVER RECOMMEND.
      /**
      * WHAT THE ****. NOW IT WORKS? TREVORE CRUPI CAN VOUCH IT WASN'T WORKING BEFORE.
      *      THIS IS A LOAD OF CRAP. SCREW THIS. INCONSISTENCY REIGNS SUPREME IN JAVASCRIPT APPARENTLY.
      *             -- Cooper (2/10/17)
      **/
    },
      function(req, email, password, done){
        process.nextTick(function() { // Async.
          createLocalUser(req, email, password, done); // That one function.
        });
      }
    ));
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
      usernameField: 'email', // Need to specify that the field we want is email, not username.
    },
    function(email, password, done) {
      process.nextTick(function() { // Async.
        logInCurrentUser(email, password, done); // That one function.
      });
    }));
};
