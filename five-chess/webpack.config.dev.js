var path = require('path');
var merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {

	devtool: 'eval',

	output: {
		pathinfo: true,
		publicPath: '/',
		filename: '[name].js'
	},
	module: {
		rules: [
		{
			test: /\.js$/,
			enforce: 'pre',
			include: [path.join(__dirname, 'src')],
			use: [
			{
				loader: 'eslint-loader',
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			}
			]
		}
		]
	}
});
