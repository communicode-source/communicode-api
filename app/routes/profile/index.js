/**
*     Express router instantiation, that Trevor decided to call "greetings"
*     for added confusion when reading... But also naming convention so
*     it's normal.
**/
const profile = require('express').Router();

profile.route('/register/interests')

  .get(require('./../../middleware/userLogin').isLoggedIn, (req, res) => {

    res.render('secure/interests.twig', {
      "title": "Welcome to Communicode"
    });
  });

// Export of rexternal use.
module.exports = profile;
