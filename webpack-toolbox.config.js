const path = require('path');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const reactPath = path.resolve(__dirname, 'node_modules\\react-toolbox');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		// './src/index.js',
		app:  './public/app.jsx',
		appt: './public/appt.jsx'
	},
	output: {
		filename: 'b[name].js',
		path: './public/script'
	},
	module: {
		rules: [
			{
				// React-hot loader and
				test: /\.jsx?$/, // All .js files
				use: [{loader: 'babel-loader'}], // react-hot is like browser sync and babel loads jsx and es6-7
				// exclude: [nodeModulesPath],
			},

			{
				test: /\.s?css$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: "style-loader",
					loader: 'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
				})
			}







		]
	},
	plugins: [
		new ExtractTextPlugin({filename: 'bundlet.css', allChunks: true }),
		// new webpack.optimize.OccurenceOrderPlugin(),
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: 'vendor',
		// 	filename: 'vendor.bundle.js',
		// 	minChunks: Infinity
		// }),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		// new webpack.DefinePlugin({
		// 	'process.env.NODE_ENV': JSON.stringify('development')
		// })
	],
	node: {
		fs: "empty"
	}
}