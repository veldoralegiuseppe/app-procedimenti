const rules = require('./webpack.rules');

rules.push(
  {test: /\.css$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },
  {test: /\.scss$/, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]},
);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
