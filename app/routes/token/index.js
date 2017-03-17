const routes     = require('express').Router();
const token      = require('./../../middleware/genToken');

routes.route('/gen')
  .get((req, res) => {
    res.status(200).json(token(req));
  })


module.exports = routes;
