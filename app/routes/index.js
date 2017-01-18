const routes    = require('express').Router();
const greetings = require('./greetings');

routes.use('/api/greeting', greetings);

routes.get('/', (req, res) => {
  res.status(200).renderFile('index.html');
});

routes.get('/api', (req, res) => {
  res.status(200).json({ message: 'Connection Made!' });
});

module.exports = routes;
