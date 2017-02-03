// Dependency used for sending mail.
var nodemailer = require('nodemailer');

// Get the super secret auth stuff.
var secrets = require('./../config/auth.json').outlook;
// Settings for the configuration of the mailer
var config = {
  host: secrets.host, // SMTP mail server.
  port: secrets.port, // SMTP port to use.
  secure: secrets.secure, // Use secure connection
  requireTLS: secrets.requireTLS, // Require TLS (secure must be false).
  auth: {
    user: secrets.auth.user, // Simply the username...
    pass: secrets.auth.pass, // 'superObviousPasswordHere',
  }
}
module.exports = nodemailer.createTransport(config); // Export it.
