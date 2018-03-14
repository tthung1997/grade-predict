var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/grade');

router.post('/', function(req, res) {
    var collection = db.get(req.body.course);
    collection.findOne({ NUID: req.body.nuid }, function(err, account) {
        if (err) throw err;
        if (account == null) {
			return res.json({});
		}
		res.json(account);
    });
});

router.get('/csce156', function(req, res) {
	var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};
	var fs = require('fs');
	fs.readFile('ml_scripts/data/csce156/grade.json', function(err, data) {
		if (err) throw err;
		var wrapObj = {
			grades: uint8ToString(data)
		};
		res.json(wrapObj);
	});
});

router.post('/csce156', function(req, res) {
    var collection = db.get('csce156');
    collection.update({ NUID: req.body.nuid }, { $set: req.body.grades }, function(err, account) {
    	if (err) throw err;
    	res.json(account);
    });
});

router.get('/csce235', function(req, res) {
	var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};
	var fs = require('fs');
	fs.readFile('ml_scripts/data/csce235/grade.json', function(err, data) {
		if (err) throw err;
		var wrapObj = {
			grades: uint8ToString(data)
		};
		res.json(wrapObj);
	});
});

router.post('/csce235', function(req, res) {
    var collection = db.get('csce235');
    var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};
    collection.update({ NUID: req.body.nuid }, { $set: req.body.grades }, function(err, account) {
    	if (err) throw err;
    	const spawn = require('child_process').spawn;
    	var params = ['ml_scripts/predict.py', 'csce235'];
    	for(var index in req.body.grades) {
    		params.push(index, req.body.grades[index]);
    	}
		const ls = spawn('python3', params);
    	ls.stdout.on('data', (data) => {
			var wrapObj = {
				predict: uint8ToString(data)
			};
            return res.json(wrapObj);
		});

		ls.stderr.on('data', (data) => {
		  console.log("stderr: " + data);
		});

		ls.on('exit', (code) => {
		  console.log("child process exited with code " + code);
		});
    });
});

/*
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

router.post('/', function(req, res) {
	var collection = db.get('accounts');
	console.log(req.body);
	collection.insert(req.body, {w: 1}, function(err, result) {
		if (err) throw err;
		//console.log(result);
		res.json(result);
	});
}); 
*/
module.exports = router;
