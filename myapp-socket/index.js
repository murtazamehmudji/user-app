var express = require('express');
var socket = require('socket.io');
var app = express();
var siofu = require('socketio-file-upload');
var fs = require('fs');

var server = app.listen(4000, function () {
	console.log('Listening at port 4000');
})

app.use(express.static('public'));
app.use(siofu.router);
var io = socket(server);

//create mysql connection
var mysql = require('mysql');
var pool = mysql.createPool({
	connectionlimit: 100,
	host: 'localhost',
	user: 'root',
	password: 'root123',
	database: 'myapp',
	debug: false
});

app.get('/', function (req, res) {
	res.sendfile('index.html');
})

io.on('connection', function (socket) {
	console.log("A user connected");

	var uploader = new siofu();
	uploader.dir = "public/uploads";
	uploader.maxFileSize = 200000;
	uploader.listen(socket);
	uploader.on("saved", function (event) {
		// console.log(event.file);
		event.file.clientDetail.base = event.file.base;
		socket.emit('imagename', event.file.base);
	});
	uploader.on("error", function (data) {
		console.log("Error: " + data.memo);
		console.log(data.error);
	});
	uploader.on("start", function (event) {
		if (/\.exe$/.test(event.file.name)) {
			console.log("Aborting: " + event.file.id);
			siofuServer.abort(event.file.id, socket);
		}
	});

	pool.getConnection(function (err, connection) {
		if (err) {
			callback(false);
			return;
		}
		var sql = "SELECT * FROM `users`";
		connection.query(sql, function (err, rows, results) {
			connection.release();
			if (!err) {
				socket.emit('rows', rows);
			}
		});
	});

	socket.on('adduser', function (userdata) {
		pool.getConnection(function (err, connection) {
			if (!err) {
				var sql = "INSERT INTO `users`(`Name`, `Email`, `Mobile`, `Password`, `Address`, `City`, `State`, `Zip`, `Image`) VALUES ('" + userdata.name + "', '" + userdata.email + "', '" + userdata.mobile + "', '" + userdata.password + "', '" + userdata.address + "', '" + userdata.city + "', '" + userdata.state + "', '" + userdata.zip + "', '" + userdata.image_name + "')";
				connection.query(sql, function (err1, rows) {
					if (!err1) {
						sql = "SELECT * FROM `users`";
						connection.query(sql, function (error, rows, fields) {
							if (!error) {
								socket.emit('rows', rows)
								socket.emit('message', 'User has been added');
								connection.release();
							}
						})
					} else {
						socket.emit('error', 'Connection Failed! Please Try Again!');
					}
				});
			}
		})
	})

	socket.on('edituser', function (userdata) {
		pool.getConnection(function (err, connection) {
			if (!err) {
				var sql = "UPDATE `users` SET `Name`='" + userdata.name + "', `Email`='" + userdata.email + "', `Mobile`='" + userdata.mobile + "', `Password`='" + userdata.password + "', `Address`='" + userdata.address + "', `City`='" + userdata.city + "', `State`='" + userdata.state + "', `Zip`='" + userdata.zip + "', `Image`='" + userdata.image_name + "' WHERE `id`='" + userdata.id + "'";
				connection.query(sql, function (err1, rows) {
					if (!err1) {
						sql = "SELECT * FROM `users`";
						connection.query(sql, function (error, rows, fields) {
							if (!error) {
								if (!userdata.old_image == "") {
									var filePath = 'public/uploads/' + userdata.old_image;
									fs.exists(filePath, function (exists) {
										if (exists) {
											fs.unlinkSync(filePath);
										}
									})
								}
								socket.emit('rows', rows)
								socket.emit('message', 'User has been edited');
								connection.release();
							}
						})
					} else {
						socket.emit('error', 'Connection Failed! Please Try Again!');
					}
				});
			}
		})
	})

	socket.on('deleterow', function (data) {
		pool.getConnection(function (err, connection) {
			var filePath = 'public/uploads/' + data.oldimage;
			fs.exists(filePath, function (exists) {
				if (exists) {
					fs.unlinkSync(filePath);
				}
			})
			var sql = "DELETE FROM `users` WHERE Mobile='" + data.mobile + "'";
			connection.query(sql, function (err, results) {
				if (!err) {
					sql = "SELECT * FROM `users`";
					connection.query(sql, function (error, rows, fields) {
						if (!error) {
							socket.emit('rows', rows)
							connection.release();
						}
					})
				}
			});
		});

	})

	socket.on('disconnect', function () {
		console.log('A user disconnected');
	});
})