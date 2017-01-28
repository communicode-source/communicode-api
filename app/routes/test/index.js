const test = require('express').Router();

test.route('/')
  .get((req, res, next) => {
    res.status(200).json({hi:"successful"});
  })
  .post((req,res, next) => {
    res.status(200).send(req.body.fn);
  });
module.exports = test;
