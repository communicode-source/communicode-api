const routes     = require('express').Router();
const greetings  = require('./greetings');
const mailDaemon = require('./mail');
const test       = require('./test');
const token      = require('./../middleware/genToken');
// Telling express what route goes to this greeting.
routes.use('/api/greeting', greetings);
// The mailing API route.
routes.use('/api/secure/mail', mailDaemon);
routes.use('/api/secure/test', test);
// res = response, req = request.
// More routing, telling express what to send back.
routes.get('/', (req, res) => {
  res.status(200).renderFile('index.html');
});

// More routing.
routes.get('/api', (req, res) => {
  res.status(200).json({ message: 'Connection Made!' });
});
// The actual generating of the token should be done when a user logs in or something.
routes.get('/tokenMe', token.generate);

// Exporting it.
module.exports = routes;
