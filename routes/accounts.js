var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/grade');

router.get('/', function(req, res) {
    var collection = db.get('accounts');
    collection.find({}, function(err, accounts) {
        if (err) throw err;
        res.json(accounts);
    });
});

router.get('/:username', function(req, res) {
    var collection = db.get('accounts');
    collection.findOne({ username: req.params.username }, function(err, account) {
        if (err) throw err;
        var uint8arrayToString = function(data) {
            return String.fromCharCode.apply(null, data);
        };
        const spawn = require('child_process').spawn;
		const ls = spawn('python3', ['ml_scripts/predict.py', 
			account.q1,
			account.q2,
			account.q3,
			account.hw1,
			account.hw2,
			account.hw3,
			account.midterm,
		]);

		ls.stdout.on('data', (data) => {
			account.predict = uint8arrayToString(data);
            return res.json(account);
		});

		ls.stderr.on('data', (data) => {
		  console.log("stderr: " + data);
		});

		ls.on('exit', (code) => {
		  console.log("child process exited with code " + code);
		});
    });
});

router.post('/', function(req, res) {
    var collection = db.get('accounts');
    collection.update({ username: req.body.username }, { $set: {
        "hw1" : Number(req.body.hw1),
        "hw2" : Number(req.body.hw2),
        "hw3" : Number(req.body.hw3),
        "hw4" : Number(req.body.hw4),
        "hw5" : Number(req.body.hw5),
        "hw6" : Number(req.body.hw6),
        "q1" : Number(req.body.q1),
        "q2" : Number(req.body.q2),
        "q3" : Number(req.body.q3),
        "q4" : Number(req.body.q4),
        "q5" : Number(req.body.q5),
        "q6" : Number(req.body.q6),
        "q7" : Number(req.body.q7),
        "q8" : Number(req.body.q8),
        "q9" : Number(req.body.q9),
        "q10" : Number(req.body.q10),
        "midterm" : Number(req.body.midterm),
        "final" : Number(req.body.final)
    }}, function(err, account) {
    	if (err) throw err;
    	res.json(account);
    });
});

module.exports = router;