var mysql = require('mysql');
var multer = require('multer');
var config = require('../config/dbconfig');
var upload = multer({ dest: 'public/uploads/' });
var fs = require('fs');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "myapp"
});

exports.get_signup_page = function (req, res, next) {
	res.render('index'), { success: req.session.success, errors: req.session.errors };
	req.session.errors = null;
}

exports.post_signup_page = [upload.single('image'), function (req, res, next) {
	req.checkBody("name").notEmpty();
	req.checkBody("email").isEmail();
	req.checkBody("mobile").notEmpty().isLength({ min: 10 });
	req.checkBody("password").notEmpty().isLength({ min: 8 });
	req.checkBody("address").notEmpty();
	req.checkBody("city").notEmpty();
	req.checkBody("state").notEmpty();
	req.checkBody("zip").notEmpty().isLength({ min: 6 });

	var errors = req.validationErrors();
	var details = req.body;
	if (errors) {
		req.session.errors = errors[0];
		req.session.success = false;
		res.render('index', { user: details, success: req.session.success, errors: req.session.errors });
	} else {
		req.session.errors = null;
		req.session.success = true;
		var sql = "INSERT INTO `users`(`Name`, `Email`, `Mobile`, `Password`, `Address`, `City`, `State`, `Zip`, `Image`) VALUES ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.mobile + "', '" + req.body.password + "', '" + req.body.address + "', '" + req.body.city + "', '" +req.body.state + "', '" + req.body.zip +"', '" + req.file.filename + "')";
		con.query(sql, function (err, result) {
			if (err) next(err);
			res.render('index', {success: req.session.success, errors: req.session.errors});
		})
	}
}]

exports.get_list_page = function (req, res, next) {
	con.query("SELECT * FROM `users`", function (err, result, fields) {
		if (err) throw err;
		res.render('list', { rows: result });
	})
}

exports.get_edit_page = function(req, res, next){
	var sql = "SELECT * FROM `users` WHERE Image='" + req.params.id + "'";
	con.query(sql, function (err, result, fields) {
		if (err) throw err;
		res.render('edit', { user: result[0] });
	})
}

exports.post_edit_page = [upload.single('image'), function(req, res, next){
	// req.checkBody("name").notEmpty();
	// req.checkBody("email").isEmail();
	// req.checkBody("mobile").notEmpty().isLength({ min: 10 });
	// req.checkBody("password").notEmpty().isLength({ min: 8 });
	// req.checkBody("address").notEmpty();
	// req.checkBody("city").notEmpty();
	// req.checkBody("state").notEmpty();
	// req.checkBody("zip").notEmpty().isLength({ min: 6 });

	// var errors = req.validationErrors();
	// var details = req.body;
	// if (errors) {
	// 	req.session.errors = errors[0];
	// 	req.session.success = false;
	// 	res.render('edit', { user: details, success: req.session.success, errors: req.session.errors });
	// } else {
		req.session.errors = null;
		req.session.success = true;
		var sql = "UPDATE `users` SET `Name`='" + req.body.name + "', `Email`='" + req.body.email + "', `Mobile`='" + req.body.mobile + "', `Password`='" + req.body.password + "', `Address`='" + req.body.address + "', `City`='" + req.body.city + "', `State`='" + req.body.state + "', `Zip`='" + req.body.zip + "', `Image`='" + req.file.filename + "' WHERE `Image`='" + req.body.oldimage + "'";
		con.query(sql, function (err, result) {
			if (err) next(err);
			var filePath = 'public/uploads/'+req.body.oldimage; 
			fs.unlinkSync(filePath);
			res.redirect('/list');
			// res.render('index', {success: req.session.success, errors: req.session.errors});
		})
	// }
}]

exports.get_delete_page = function(req, res, next){
  var sql = "DELETE FROM users WHERE Image = '" + req.params.id + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
	var filePath = 'public/uploads/'+req.params.id; 
	fs.unlinkSync(filePath);
	res.redirect('/list');
  });
}