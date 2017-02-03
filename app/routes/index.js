const routes    = require('express').Router();
const greetings = require('./greetings');

// Telling express what route goes to this greeting.
routes.use('/api/greeting', greetings);

// res = response, req = request.
// More routing, telling express what to send back.
routes.get('/', (req, res) => {
  res.status(200).renderFile('index.html');
});

// More routing.
routes.get('/api', (req, res) => {
  res.status(200).json({ message: 'Connection Made!' });
});

// Exporting it.
module.exports = routes;
