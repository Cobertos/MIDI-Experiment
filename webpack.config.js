 module.exports = {
	context: __dirname,
	entry: "./src/index",
	output: {
		path: __dirname + "/public",
		filename: "dist.js"
	},
	externals: {
		jzz: 'JZZ'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['env'],
					plugins: ["transform-runtime"]
				}
			}
		}]
	}
};