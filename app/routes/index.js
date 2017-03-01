const routes     = require('express').Router();
const greetings  = require('./greetings');
const mailDaemon = require('./mail');
const test       = require('./test');
const token      = require('./../middleware/genToken');
const auth       = require('./../config/auth.json');
const AuthRoutes = require('./oauth');
const UserRoutes = require('./users');
const userInt    = require('../handlers/User');
const path       = require('path');
// Telling express what route goes to this greeting.
routes.use('/api/greeting', greetings);
// The mailing API route.
routes.use('/api/secure/mail', mailDaemon);
// Just a test route I created.
routes.use('/api/secure/test', test);
// View all users in the database.
routes.use('/api/users', UserRoutes);
// Login/Logout routes and temporary profile route.
routes.use('/oauth', AuthRoutes);
// The actual generating of the token should be done when a user logs in or something.
routes.get('/tokenMe', token.generate);


// res = response, req = request.
// More routing, telling express what to send back.
routes.get('/api', (req, res) => {
  res.status(200).json({ message: 'Connection Made!' });
});
routes.get('/:user', (req, res) => {
  var getData = new userInt(req);
  getData.getUrl(req.params.user, function(err, users){
    if(err || users.length > 1) {
      res.status(200).send('Failed');
      return;
    }
    var user = users[0];
    if(!user) {
      res.status(200).send('No username exists');
      return;
    }
    getData.getProfile(user.userId, function(user) {
      res.status(200).json(user);
    });
  });
});

routes.get('/', (req, res) => {
  if(new userInt(req).isSignedIn() === false){
    res.sendFile(path.join(__dirname, '../../web/html/public/index.html'));
  } else {
    res.sendFile(path.join(__dirname, '../../web/html/secure/dashboard.html'));
  }
});
// Exporting it.
module.exports = routes;
