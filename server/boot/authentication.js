'use strict';

module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth();

  var loopback = require('loopback');
  server.middleware('auth', loopback.token({
    model: server.models.accessToken,
    currentUserLiteral: 'self'
  }));
};
