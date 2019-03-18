var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.send('Server is Live');
});

router.get('/image/:id', function(req,res,next){
	var image_path = 'public/uploads/'+req.params.id;
	var image = fs.readFileSync(image_path);
	res.status(200).contentType('image/jpg').send(image);
})

module.exports = router;
