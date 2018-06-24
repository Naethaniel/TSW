//Imports
const path = require('path');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const passport = require('passport');
const socketIo = require('socket.io');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');

//MongoDb
mongoose.connect('mongodb://localhost/uBuy');
const db = mongoose.connection;

//Init app
const app = express();

//Webpack
const compiler = webpack(webpackConfig);

//HBS configuration
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: path.join(__dirname + '/src/hbs/layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/src/hbs'));

//Cookie and body parser
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
//Serve static
app.use(express.static(path.join(__dirname + '/src')));
//Session
const sessionSecret = 'iLoveSecrets#222';
const sessionKey = 'express.sid';
app.use(session({
  key: sessionKey,
  secret: sessionSecret,
  saveUninitialized: true,
  resave: true,
}));
//Middleware Passport.js
app.use(passport.initialize());
app.use(passport.session());
//Express validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    let namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
//Webpack compiler for server
app.use(webpackDevMiddleware(compiler, {
  hot: true,
  filename: 'bundle.js',
  publicPath: '/',
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));
//Flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Socket.IO
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);
// app.io = io;
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });
// io.sockets.on('connect', (socket) => {
//   console.log('Socket.io: połączono.');
// });

//Routing
const index = require('./routes/index');
const auctions = require('./routes/auctions');
const messages = require('./routes/messages')(io);
// const register = require('./routes/register');
app.use('/', index);
app.use('/auctions', auctions);
app.use('/messages', messages);

const server = app.listen(8080, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

