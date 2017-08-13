 module.exports = {
    context: __dirname,
    entry: "./index",
    output: {
        path: __dirname,
        filename: "webpack_index.js"
    },
    externals: {
	  	jzz: 'JZZ'
	}
};