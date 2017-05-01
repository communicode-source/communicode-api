/**
*     Express router instantiation, that Trevor decided to call "greetings"
*     for added confusion when reading... But also naming convention so
*     it's normal.
**/
const profile = require('express').Router();

profile.route('/register/step.2')

  .get(require('./../../middleware/userLogin').isLoggedIn, (req, res) => {

    var UserHandler = req._userClass;
    var id = UserHandler.getSessUser("_id");
    if(!UserHandler.getSessUser('accountType')) {
      UserHandler.getUserAttributes(["fName", "lName"], id, function(err, result) {
        res.render('secure/interests.twig', {
          "title": "Welcome to Communicode",
          "_id": id,
          "fName": result.fName,
          "lName": result.lName
        });
      });
    } else {

      res.render('secure/type.twig', {
        "title": "Welcome to Communicode",
        "_id": id
      });

    }
  });

// Export of rexternal use.
module.exports = profile;
