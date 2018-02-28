var express = require('express');
var multer = require('multer');
var router = express.Router();

const multerConfig = {
    storage: multer.diskStorage({
        destination: function(req, file, next) {
            next(null, './public/file-storage');
        },   
        filename: function(req, file, next) {
            console.log(file);
            const ext = file.mimetype.split('/')[1];
            next(null, 'grade.' + ext);
        }
    })
};

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

router.get('/createModels', function(req, res) {
    var uint8ToString = function(data) {
        return String.fromCharCode.apply(null, data);
    };
    var wrapObj = {
        params: ""
    };
    var fs = require('fs');
    fs.readFile("ml_scripts/models/params.txt", function(err, data) {
        if (err) {
            throw err;
        } 
        wrapObj.params = uint8ToString(data);
        res.json(wrapObj);
    });
});

router.post('/createModels', function(req, res) {
    var uint8ToString = function(data) {
        return String.fromCharCode.apply(null, data);
    };
    var wrapObj = {
        text: ""
    };
    const spawn = require('child_process').spawn;
	const ls = spawn('python3', ['ml_scripts/train_models.py']);
    ls.stdout.on('data', (data) => {
        wrapObj.text = uint8ToString(data);
        var fs = require('fs');
        fs.writeFile("ml_scripts/models/params.txt", wrapObj.text, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("File saved.");
            }
        });
        return res.json(wrapObj);
    }); 
	ls.stderr.on('data', (data) => {
		console.log("stderr: " + data);
	});
	ls.on('exit', (code) => {
		console.log("child process exited with code " + code);
	});
});

router.post('/upload', multer(multerConfig).single('csvfile'), function(req, res) {
    res.redirect('/#/profProfile');
});

module.exports = router;
