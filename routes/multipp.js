var express = require('express');
var router = express.Router();

router.post('/properties', function(req, res) {
	var uint8ToString = function(data) {
		return String.fromCharCode.apply(null, data);
	};
	var fs = require('fs');
	function readProperties(callback) {
		fs.readFile("temp/" + req.body.filename + ".txt", function(err, data) {
			if (err)
				return console.log(err);
			callback(uint8ToString(data));
		});
	}
	readProperties(function(data) {
		var wrapObj = {
			list: data.trim().split(",")
		};
		res.json(wrapObj);
	});
});

module.exports = router;
