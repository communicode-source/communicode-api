const matches = require('express').Router();

var Matches = require('./../../models/Matches');

matches.route('/matches')

  .get((req , res) => {
    res.status(200).json({message: "Matches go here"});
  });

  matches.route('/:id')

    .get((req, res) => {
      var id = req.params.id;
      res.status(200).json({ id: id, name: "Match"});
    });
module.exports = matches
