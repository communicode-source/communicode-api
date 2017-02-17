const emailer = require('./../models/Mailer.js');
const fs = require('fs');

const emailFunctions = {
  newUserEmail: function(email, name, link) {
    fs.readFile(__dirname+'/../../../mailTemplates/views/newUser.html', 'utf8', function(err, html){
      var data = {
        "name": name,
        "link": link
      };
      var mailOptions = {
        from: '"Communicode ?" <communicode@outlook.com>', // Obvious who this comes from.
        subject: "Welcome to Communicode", // Subject of the email.
        html: html // The html template.
      };
      var temp = emailer.templateSender(mailOptions);
      temp({to: email}, data, function(err, info){
        res.status(200).json({err: (err == null) ? false : err, details: info});
      });
    });
  }
}

module.exports = emailFunctions;
