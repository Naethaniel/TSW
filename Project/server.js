//Express
const express = require('express');
const app = express();

//Webpack
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);

//Handlebars
const hbs = require('express-handlebars');

//Path
const path = require('path');

//Passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Socket.io
const socketIo = require('socket.io');
const passportSocketIo = require('passport.socketio');

//MongoDb
const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/uBuy');
const db = mongoose.connection;

//Conf passport.js
passport.serializeUser( (user, done) => {
  done(null, user);
});

passport.deserializeUser( (obj, done) => {
  done(null, obj);
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    if ((username === 'admin') && (password === 'tajne')) {
      console.log('Udane logowanie...');
      return done(null, {
        username: username,
        password: password
      });
    } else {
      return done(null, false);
    }
  }
));

//Routing
const index = require('./routes/index');
const login = require('./routes/login');
const register = require('./routes/register');
app.use('/', index);
app.use('/login', login);
app.use('/register', register);

//Cookie and body parser
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

//Session
const sessionSecret = 'iLoveSecrets#222';
const sessionKey = 'express.sid';
const session = require('express-session');
app.use(session({
  key: sessionKey,
  secret: sessionSecret,
  saveUninitialized: true,
}));

//Middleware Passport.js
app.use(passport.initialize());
app.use(passport.session());

//Serve static
app.use(express.static(path.join(__dirname + '/src')));

//HBS configuration
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname + '/src/hbs/layouts')}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/src/hbs'));

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

const server = app.listen(8080, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});