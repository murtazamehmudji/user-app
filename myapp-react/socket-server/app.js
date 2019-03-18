var createError = require('http-errors');
var express = require('express');
var socket = require('socket.io');
var fs = require('fs');
var siofu = require('socketio-file-upload');
var queries = require('./queries/queries');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// Socket.io
var io = socket();
app.io = io;

// socket.io events
io.on('connection', function (socket) {
	console.log("A user connected");
	app.socket = socket;
	var uploader = new siofu();
	uploader.dir = "public/uploads";
	uploader.maxFileSize = 200000;
	uploader.listen(socket);
	uploader.on("saved", function (event) {
		event.file.clientDetail.base = event.file.base;
	});
	uploader.on("error", function (data) {
		console.log("Error: " + data.memo);
		socket.emit('error', data.error);
	});
	uploader.on("start", function (event) {
		if (/\.exe$/.test(event.file.name)) {
			console.log("Aborting: " + event.file.id);
			siofuServer.abort(event.file.id, socket);
		}
	});

	queries.get_users((err, data) => {
		if (err == "No data") {
			socket.emit('rows', []);
		}
		if (err) {
			socket.emit('error', err);
		} else {
			io.sockets.emit('rows', data);
		}
	});

	function getusers() {
		queries.get_users((err, data) => {
			if (err == "No data") {
				io.sockets.emit('rows', []);
			}
			if (err) {
				socket.emit('error', err);
			} else {
				io.sockets.emit('rows', data);
			}
		});
	}

	function deleteimage(imagename) {
		if (imagename != "") {
			var filePath = 'public/uploads/' + imagename;
			fs.exists(filePath, function (exist) {
				if (exist) {
					fs.unlinkSync(filePath);
				}
			})
		}
	}

	socket.on('adduser', function (userdata) {
		if(Object.keys(userdata).length >= 5){
			queries.add_user(userdata, (err, msg) => {
				if (err) {
					socket.emit('error', err);
				} else {
					socket.emit('message', msg);
					getusers();
				}
			})
		}
	})

	socket.on('edituser', function (userdata) {
		if(Object.keys(userdata).length >= 5){
			queries.edit_user(userdata, (err, msg) => {
				if (err) {
					socket.emit('error', err);
				} else {
					deleteimage(userdata.old_image);
					socket.emit('message', msg);
					getusers();
				}
			})
		}
	})

	socket.on('getrowdetails', function (data) {
		queries.get_row_details(data.id, (err, row) => {
			if (err) {
				socket.emit('error', err);
			} else {
				socket.emit('showrowdetails', row);
			}
		})
	})

	socket.on('deleterow', function (data) {
		queries.delete_user(data, (err, msg) => {
			if (err) {
				socket.emit('error', err);
			} else {
				deleteimage(data.old_image);
				getusers();
				socket.emit('message', msg);
			}
		})
	})

	socket.on('disconnect', function () {
		console.log('A user disconnected');
	});
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	req.io = io;
	req.socket = app.socket;
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
