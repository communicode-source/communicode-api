const routes     = require('express').Router();
const greetings  = require('./greetings');
const UserRoutes = require('./users');
const developers = require('./users/developers');
const nonprofits = require('./users/nonprofits');
const projects   = require('./projects');
routes.use('/greeting', greetings);
routes.use('/users', UserRoutes);
routes.use('/developers', developers);
routes.use('/nonprofits', nonprofits);
routes.use('/api/projects', projects);
routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connection Made!' });
});


// Exporting it.
module.exports = routes;
