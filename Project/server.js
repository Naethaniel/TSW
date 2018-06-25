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
  layoutsDir: path.join(__dirname + '/src/hbs/layouts'),
  helpers: {
    // Function to do basic mathematical operation in handlebar
    math: function (lvalue, operator, rvalue) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
      return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
      }[operator];
    }
  }
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
const mongoStore = require('connect-mongo')(session);
const store = new mongoStore({
  url: 'mongodb://localhost/uBuy',
  ttl: 600
});
app.use(session({
  key: sessionKey,
  secret: sessionSecret,
  saveUninitialized: true,
  resave: true,
  store: store
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

const server = app.listen(8080, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('uBuy listening at http://%s:%s', host, port);
});

//Socket.IO

const io = require('socket.io')(server);
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: sessionKey,
  secret: sessionSecret,
  store: store
}));

//Routing
const index = require('./routes/index');
const auctions = require('./routes/auctions');
const messages = require('./routes/messages')(io);
// const register = require('./routes/register');
app.use('/', index);
app.use('/auctions', auctions);
app.use('/messages', messages);


