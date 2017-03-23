const matches = require('express').Router();

var Match = require('../../models/Matches.js');

matches.route('/')

  .get((req , res) => {
    Match.find({}, function(err, matches) {
      res.status(200).json(matches);
    });
  })

  .post((req,res) => {
    var newMatch = new Match({
      'developer' : req.body.developer,
      'nonprofit' : req.body.nonprofit,
      'percentage': req.body.percentage
    });

    newMatch.save((err, data) => {
      if (err) throw err;

      console.log("Saved: " + JSON.stringify(data));
    });
  });

  matches.route('/:id')

    .get((req, res) => {
      var id = req.params.id;
      Match.findById(id, function(err, matches) {
        if (err)
          res.status(500).json({"error": "Greeting with that ID does not exist"});

        res.status(200).json(matches);
      });
    })



    //  Match.findById(id, function()
module.exports = matches;
