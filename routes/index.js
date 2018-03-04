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

module.exports = router;
