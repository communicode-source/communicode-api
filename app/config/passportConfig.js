const FacebookStrategy  = require('passport-facebook').Strategy; // Allows for Facebook validation.
const GithubStrategy    = require('passport-github').Strategy; // Allowws for Github validation.
const LocalStrategy     = require('passport-local').Strategy;
var User                = require('./../models/User'); // User model.
const auth              = require('./auth.json'); // Super secret sauces.


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

    // =========================================================================
    // LOCAL REGISTRATION ======================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
      usernameField: 'email', // Changes the default from 'username' to 'email.'
      passReqToCallback : true // THIS IS THE DUMBEST THING EVER. SINCE WHEN DID HAVING A SPACE AFTER THE KEY TO A JSON OBJECT ACTUALLY AFFECT THE GOSH DANG VALUE.
    },
      function(req, email, password, done){
        process.nextTick(function() { // Async.
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
              newUser.fname = (req.body.fname) ? req.body.fname : null;
              newUser.lname = (req.body.lname) ? req.body.lname : null;
              newUser.password = newUser.generateHash(password); // This is why the weird syntax seems necessary.

              newUser.save(function(err){ // Save the user.
                if(err)
                  throw err;
                return done(null, newUser);
              });
            }
          });
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
        })});
    }));
};
