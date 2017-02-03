/**
*     Express router instantiation, that Trevor decided to call "greetings"
*     for added confusion when reading... But also naming convention so
*     it's normal.
**/
const greetings = require('express').Router();

// Requiring the mongoose schema.
var Greeting = require('../../models/Greetings');

// This is somewhat odd looking syntax, but this is essentially making routes for the greeting api.
greetings.route('/')
  // Fir GET HTTP request type.
  .get((req, res) => {
    Greeting.find({}, function(err, greetings) {
      res.status(200).json(greetings);
    });
  })
  // For POST HTTP request type.
  .post((req, res) => {
    var newGreeting = new Greeting({
      'language': req.body.language,
      'text': req.body.text
    });

    newGreeting.save((err, data) => {
      if (err) throw err;

      console.log("Saved: " + JSON.stringify(data));
    });
  });

// This is still an express route, but has a required wildcard of ID.
greetings.route('/:id')
  // Same HTTP protocols being used.
  .get((req, res) => {
    // req.params.:SOMETHING, how to get the /:id from the URL with Express.
    // Greeting is the mongoose schema, so we are making a query here.
    Greeting.findById(req.params.id, function(err, greeting) {
      if(err)
        res.status(404).json({"error": "Greeting with that ID does not exist"});

      res.status(200).json(greeting);
    });
  })
  // PUT protocol is for updates.
  .put((req, res) => {
    Greeting.findById(req.params.id, function(err, greeting) {
      if(err)
        res.status(500).json({"error": "Could not update"});

      greeting.language = req.body.language;
      greeting.text = req.body.text;
      greeting.save();
      res.status(200).json({"message": "Updated successfully"});
    });
  })
  // DELETE protocol is self explanatory.
  .delete((req, res) => {
    Greeting.remove({ _id: req.body.id }, function(err) {
        if (!err)
          res.status(500).json({"error": "Something went wrong"});

        res.status(200).json({"message": "Deleted successfully"});
    });
  });

  // API to get greetings by language, as defined by the route.
  greetings.route('/filter/:language')

    .get((req, res) => {
      Greeting.find({"language": req.params.language}, function(err, greetings) {
        if(err)
          res.status(404).json({"error": "No greetings for that language yet!"});

        res.status(200).json(greetings);
      });
    });

// Export of rexternal use.
module.exports = greetings;
