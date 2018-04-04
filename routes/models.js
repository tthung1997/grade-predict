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

/*router.get('/', function(req, res) {
    var uint8ToString = function(data) {
        return String.fromCharCode.apply(null, data);
    };
	var wrapObj = {
		course: "",
		 params: ""
	};
	var fs = require("fs");
	function readCourse(callback) {
		fs.readFile("ml_scripts/models/recent-course.txt", function(err, data) {
			if (err) {
				throw err;
			}
			callback(uint8ToString(data));
		});
	}
	function readParams(callback) {
	    fs.readFile("ml_scripts/models/params.txt", function(err, data) {
		    if (err) {
			    throw err;
			} 
			callback(uint8ToString(data));
		});
	}
	readCourse(function(course) {
		wrapObj.course = course;
		readParams(function (params) {
			wrapObj.params = params;
			console.log(wrapObj);
			res.json(wrapObj);
		})
	})
});*/
/*
router.post('/recent', function(req, res) {
	var wrapObj = {
		course: req.body.course
	};
	fs = require('fs');
	fs.writeFile("ml_scripts/models/recent-course.txt", wrapObj.course, function(err) {
		if (err)
			throw err;
		else {
			console.log("Course saved.");
		}
	});
});

router.get('/recent', function(req, res) {
	var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};
	fs = require('fs');
	function readCourse(callback) {
		fs.readFile("ml_scripts/models/recent-course.txt", function(err, data) {
			if (err)
				throw err;
			callback(uint8ToString(data));
		});
	}
	readCourse(function(data) {
		var wrapObj = {
			course: data
		};
		res.json(wrapObj);
	});
});
*/
router.post('/', function(req, res) {
    var uint8ToString = function(data) {
        return String.fromCharCode.apply(null, data);
    };
    var wrapObj = {
		course: req.body.course,
		noOfModels: 0,
        params: "",
		grades: []
    };
    const spawn = require('child_process').spawn;
	const ls = spawn('python3', ['ml_scripts/train_models_new.py', req.body.course]);
    ls.stdout.on('data', (data) => {
        temp = uint8ToString(data).split(';');
        wrapObj.noOfModels = temp[0];
		wrapObj.params = temp[1];
		wrapObj.grades = temp[2];
        var fs = require('fs');
/*		fs.writeFile("ml_scripts/models/recent-course.txt", wrapObj.course, function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Course recorded.");
			}
		});*/
		fs.writeFile("ml_scripts/models/" + wrapObj.course + "/noOfModels.txt", wrapObj.noOfModels, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("#Models saved.");
            }
        });
        fs.writeFile("ml_scripts/models/" + wrapObj.course + "/params.txt", wrapObj.params, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Params saved.");
            }
        });
		fs.writeFile("ml_scripts/data/" + wrapObj.course + "/grade.json", wrapObj.grades, function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Grade.json created.");
			}
		});
        //return res.json(wrapObj);
        return res.send('OK');
        //return;
    }); 
	ls.stderr.on('data', (data) => {
		console.log("stderr: " + data);
	});
	ls.on('exit', (code) => {
		console.log("child process exited with code " + code);
	});
});

router.post('/upload', multer(multerConfig).single('csvfile'), function(req, res) {
	res.redirect('/#/profProfile/');
});

module.exports = router;
