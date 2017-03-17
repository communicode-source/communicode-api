const routes     = require('express').Router();
const greetings  = require('./greetings');
const mailDaemon = require('./mail');
const token      = require('./../middleware/genToken');
const auth       = require('./../config/auth.json');
const AuthRoutes = require('./oauth');
const UserRoutes = require('./users');
const profile    = require('./profile');

routes.use('/api/greeting', greetings);
routes.use('/api/secure/mail', mailDaemon);
routes.use('/api/users', UserRoutes);
routes.use('/oauth', AuthRoutes);
routes.use('/', profile);

routes.get('/tokenMe', token.generate);

// res = response, req = request.
// More routing, telling express what to send back.
routes.get('/api', (req, res) => {
  res.status(200).json({ message: 'Connection Made!' });
});

routes.get('/', (req, res)=> {
  res.render("public/index.twig", {
    "title": "Welcome to Communicode"
  })
});

// Exporting it.
module.exports = routes;
