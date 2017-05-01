const routes     = require('express').Router();

routes.route('/')
  .get((req, res) => {
    res.status(200).json({'success': 'Welcome!'})
  })

module.exports = routes;
