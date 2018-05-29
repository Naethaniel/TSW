const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const hbs = require('express-handlebars');
const path = require('path');

const app = express();

const compiler = webpack(webpackConfig);

app.use(express.static(path.join(__dirname + '/src')));
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname + '/src/hbs/layouts')}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/src/hbs'));

app.route('/')
  .get((req, res) => {
    res.render('./index', {title: 'uBuy'});
  });

app.route('/login')
  .get((req, res) => {
    res.render('login.html');
  });

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