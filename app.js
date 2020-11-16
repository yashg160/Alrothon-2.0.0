var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var programRouter = require('./routes/program');
var teacherRouter = require('./routes/teacher');
var usersRouter = require('./routes/users');

var app = express();




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cookieParser('secret'));
app.use(cors());
mongoose.connect('mongodb+srv://sumit:sumitbhagat@cluster0.1pfkx.mongodb.net/albenero?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
// mongoose.connect('mongodb://localhost:27017/routine', { useNewUrlParser: true });
var db = mongoose.connection;



db.on('error', console.error.bind(console, '[DB CONNECTION ERROR]'));
db.once('open', function () {
  console.log('[DB CONNECTED]');
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/program', programRouter);
app.use('/api/teacher', teacherRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// client.connect(function (err) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   client.close();
// });

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
