var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors')
const guestsRouter = require('./routes/guests');
const roomsRouter = require('./routes/rooms');
const baseRouter = require('./routes/base');
const userRouter = require('./routes/users');

var app = express();
app.use(cors());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/guests', usersRouter.verifyToken, guestsRouter.findAll);
app.get('/guests/:id', guestsRouter.findOne);

app.post('/guests', guestsRouter.addGuest);

app.delete('/guests/remove', guestsRouter.deleteCheckOut);
app.delete('/guests/:id', guestsRouter.deleteGuest);

//room routes
app.get('/rooms', roomsRouter.findAll);
app.get('/rooms/empty', roomsRouter.findEmptyRooms);
app.get('/rooms/:id', roomsRouter.findOne);

app.put('/rooms/ready/:id', roomsRouter.roomReady);
app.put('/rooms/maintain/:id', roomsRouter.roomMaintain);

app.delete('/rooms/:id', roomsRouter.deleteRoom);

//base routes
app.put('/rooms/assign/:id', baseRouter.AssignRoom);
app.put('/rooms/checkout/:id', baseRouter.CheckoutRoom);

//user routes
app.post('/users', userRouter.createUser);
app.post('/users/login', usersRouter.login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
