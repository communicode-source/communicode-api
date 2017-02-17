const redis           = require("redis");
const session         = require('express-session');
const redisStore      = require('connect-redis')(session);
const redisConfig     = require('./auth.json').redisOptions;


module.exports = function(app) {
  const client = redis.createClient(redisConfig.port, redisConfig.host);
  app.use(session({
    secret: 'keybpard kitten',
    store: new redisStore({ host: redisConfig.host, port: redisConfig.port, client: client, ttl :  redisConfig.ttl}),
    saveUninitialized: true,
    resave: true
  }));
  client.on('error', function(err) {
    console.log("Connection to redis could not be made... Did you forget to run redis-server?");
  });
}
