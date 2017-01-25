/**
*   Trying to do the Matches assignment, not quite sure what I'm really doing
*   but I started to model it after the index.js from Greetings
**/
const matches = require('express').Router();
// Requiring the mongoose schema.
var Matches = require('../../models/Matches');

matches.route('/')

    //
    .get((req, res) => {
      //don't quite know what to put here, need more knowledge with node

    .post((req, res) => {
      //Same as above
    }


//exports
module.export = matches;
