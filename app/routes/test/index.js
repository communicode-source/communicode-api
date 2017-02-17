const test = require('express').Router();

test.route('/')
  .get((req, res, next) => {
    res.status(200).json({hi:"successful"});
  })
  .post((req,res, next) => {
    res.status(200).json({hi: "successful"});
  });
module.exports = test;
