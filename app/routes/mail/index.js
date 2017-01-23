/**
* INSTRUCTIONS FOR SENDING MAIL.
*   1. Use POST request.
*   2. POST data is as follows =
*     {
*       subject : Subject of message.
*       html    : HTML template file, as located in the mailTemplates folder (remove the extension).
*       template : for all templating data, you need a corresponding one here.
*       target  : recipients as a string, e.x. "g@gmail.com, a@outlook.com..."
*     }
*   3. Returns JSON with either an error of what went wrong or the details of the email if sent.
**/


// Instance of the Express Router.
const mail = require('express').Router();
// Mail Daemon model.
var Mailer = require('../../models/Mailer');

// Used to get the HTML template (if there is a better way please let me know).
var fs = require('fs');

// Route to send emails.
mail.route('/')
  .get((req, res, next) => { // Should not use GET for emailing.
    res.status(200).json({'err': 'Cannot send an email via GET, must use POST'});

    })
  .post((req, res) => { // This is the route to use for emailing a single individual.
    fs.readFile(__dirname+'/../../../mailTemplates/views/'+req.body.html+'.html', 'utf8', function(err, html){
      // Making sure the templating file actually exists before doing anything.
      if(err) {
        res.status(200).json({"err": true, "msg": "invalid template"}); // Return an error if the templating HTML doc is not found.
      } else {
        // Standard emailing things.
        var mailOptions = {
          from: '"Communicode ?" <communicode@outlook.com>', // Obvious who this comes from.
          subject: req.body.subject, // Subject of the email.
          html: html // The html template.
        };

        // Tells NodeMailer that we are using a template.
        var temp = Mailer.templateSender(mailOptions);

        // Until I work out some kinks.
        var data = require('./../../../mailTemplates/data/'+req.body.html);
        for(var key in data){
          data[key] = req.body[key];
        }

        // Sends the email with the given information, returns either the error or the details.
        temp({to: req.body.target}, data, function(err, info){
          //var error = (err == null) ? false : err
          res.status(200).json({'err': (err == null) ? false : err, 'details': info});
        });
      }

    });
  });

// Export.
module.exports = mail;
