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

router.get('/', function(req, res) {
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

router.post('/', function(req, res) {
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
