var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res) {
    const nodemailer = require('nodemailer');
    var wrapObj = {
        code: ""
    };
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++)
        wrapObj.code += possible.charAt(Math.floor(Math.random() * possible.length));
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'predapp.system@gmail.com',
            pass: 'metsysppaderp'
        }
    });
    var mailOptions = {
        from: 'predapp.system@gmail.com',
        to: req.body.email,
        subject: 'Confirmation',
        html: '<h1>Hi! Welcome to the system.</h1><p><i>This is an auto-generated email from Grade Prediction System.</i></p><p>Your confirmation code is: <font size="6"><b>' + wrapObj.code + '</b></font></p>'
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.json(wrapObj);
}); 

module.exports = router;
