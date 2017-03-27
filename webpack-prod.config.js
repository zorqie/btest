const path = require('path');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const reactPath = path.resolve(__dirname, 'node_modules\\react-toolbox');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		// './src/index.js',
		// app:  './public/app.jsx',
		main: './public/main.jsx',
		// vapp: './public/vapp.jsx',
		// appt: './public/appt.jsx'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './public/bundle')
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
					fallback: {loader: "style-loader"},
					loader: 'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
				})
			}
		]
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        }),
		new ExtractTextPlugin({filename: '[name].css', allChunks: true }),
		new webpack.DefinePlugin({
			'typeof window': "\"object\"",
			'process.env.NODE_ENV': JSON.stringify('production')
		})
	],
	node: {
		fs: "empty"
	}
}