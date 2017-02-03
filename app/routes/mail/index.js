// Instance of the Express Router.
const mail = require('express').Router();
// Mail Daemon model.
var Mailer = require('../../models/Mailer');


var fs = require('fs');

// Route to send emails.
mail.route('/')
  .get((req, res, next) => { // Should not use GET for emailing.
    res.status(200).json({'err': 'Cannot send an email via GET, must use POST'});
    next();
    })
  .post((req, res) => { // This is the route to use for emailing a single individual instantly.
    fs.readFile(__dirname+'/../../../mailTemplates/'+req.body.html+'.html', 'utf8', function(err, html){
      var mailOptions = {
        from: '"Communicode ?" <communicode@outlook.com>', // Obvious who this comes from.
        subject: req.body.subject, // Subject of the email.
        text: req.body.text, // Text of the email.
        html: html // HTML emailing...
      };
      // Actually sends the email.
      var temp = Mailer.templateSender(mailOptions);
      temp({to: req.body.target}, req.body.template, function(err, info){
        res.status(200).json({'err': (err == null) ? false : err, 'details': info});
      });
    });
  });

// Export.
module.exports = mail;
