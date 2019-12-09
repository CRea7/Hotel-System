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
app.get('/guests', /*usersRouter.verifyToken,*/ guestsRouter.findAll);
app.get('/guests/:id',/*usersRouter.verifyToken,*/ guestsRouter.findOne);

app.post('/guests',/*usersRouter.verifyToken,*/ guestsRouter.addGuest);

app.delete('/guests/remove',/*usersRouter.verifyToken,*/ guestsRouter.deleteCheckOut);
app.delete('/guests/:id',/*usersRouter.verifyToken,*/ guestsRouter.deleteGuest);

//room routes
app.get('/rooms',/*usersRouter.verifyToken,*/ roomsRouter.findAll);
app.get('/rooms/empty',/*usersRouter.verifyToken,*/ roomsRouter.findEmptyRooms);
app.get('/rooms/:id',/*usersRouter.verifyToken,*/ roomsRouter.findOne);

app.put('/rooms/ready/:id',/*usersRouter.verifyToken,*/ roomsRouter.roomReady);
app.put('/rooms/maintain/:id',/*usersRouter.verifyToken,*/ roomsRouter.roomMaintain);

app.delete('/rooms/:id',/*usersRouter.verifyToken,*/ roomsRouter.deleteRoom);

//base routes
app.put('/rooms/assign/:id',/*usersRouter.verifyToken,*/ baseRouter.AssignRoom);
app.put('/rooms/checkout/:id',/*usersRouter.verifyToken,*/ baseRouter.CheckoutRoom);

//user routes
app.post('/users', userRouter.createUser);
app.post('/users/login', usersRouter.login);

app.put('/users/logout', usersRouter.logout);

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
