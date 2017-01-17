const path = require('path');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
	entry: [
		// './src/index.js',
		'./public/app.jsx'
	],
	output: {
		filename: 'bundle.js',
		path: './public/script'
	},
	module: {
		loaders: [
			{
				// React-hot loader and
				test: /\.js$/, // All .js files
				loaders: ['react-hot-loader', 'babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
				exclude: [nodeModulesPath],
    		},
    		{
				// React-hot loader and
				test: /\.jsx$/, // All .jsx files
				loaders: ['babel-loader'], // react-hot is like browser sync and babel loads jsx and es6-7
				exclude: [nodeModulesPath],
			},
    	]
	},
	node: {
		fs: "empty"
	}
}