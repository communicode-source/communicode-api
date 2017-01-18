const greetings = require('express').Router();

var Greeting = require('../../models/Greetings');

greetings.route('/')

  .get((req, res) => {
    Greeting.find({}, function(err, greetings) {
      res.status(200).json(greetings);
    });
  })

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

greetings.route('/:id')

  .get((req, res) => {
    Greeting.findById(req.params.id, function(err, greeting) {
      if(err)
        res.status(404).json({"error": "Greeting with that ID does not exist"});

      res.status(200).json(greeting);
    });
  })

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

  .delete((req, res) => {
    Greeting.remove({ _id: req.body.id }, function(err) {
        if (!err)
          res.status(500).json({"error": "Something went wrong"});

        res.status(200).json({"message": "Deleted successfully"});
    });
  });

  greetings.route('/filter/:language')

    .get((req, res) => {
      Greeting.find({"language": req.params.language}, function(err, greetings) {
        if(err)
          res.status(404).json({"error": "No greetings for that language yet!"});

        res.status(200).json(greetings);
      });
    });

module.exports = greetings;
