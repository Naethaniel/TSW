const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.join(__dirname, 'src'),
    mode: 'development',
    entry: [
        './js/main.js',
    ],
    devServer: {
        contentBase: 'src/html',
        overlay: true
    },
  plugins: [
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
      })
  ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ]
            },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].html'
                }
              },
              {
                loader: 'extract-loader'
              },
              {
                loader: 'html-loader',
                options: {
                  attrs: ['img:src']
                }
              }
            ]
          },
            {
                test: /\.less/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'style-loader', // inject CSS to page
              }, {
                loader: 'css-loader', // translates CSS into CommonJS modules
              }, {
                loader: 'postcss-loader', // Run post css actions
                options: {
                  plugins: () => { // post css plugins, can be exported to postcss.config.js
                    return [
                      require('precss'),
                      require('autoprefixer')
                    ];
                  }
                }
              }, {
                loader: 'sass-loader' // compiles Sass to CSS
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader'
              },
              {
                loader: 'postcss-loader'
              }
            ]
          },
        ],
    },
};