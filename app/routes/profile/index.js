/**
*     Express router instantiation, that Trevor decided to call "greetings"
*     for added confusion when reading... But also naming convention so
*     it's normal.
**/
const profile = require('express').Router();

var Handler = require('./../../handlers/User');

profile.route('/register/interests')

  .get(require('./../../middleware/userLogin').isLoggedIn, (req, res) => {

    var UserHandler = new Handler(req);
    var _id = UserHandler.getSessUser("_id");
    res.render('secure/interests.twig', {
      "title": "Welcome to Communicode",
      "_id": _id
    });
  });

// Export of rexternal use.
module.exports = profile;
