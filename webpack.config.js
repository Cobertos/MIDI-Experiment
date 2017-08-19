 module.exports = {
    context: __dirname,
    entry: "./src/index",
    output: {
        path: __dirname + "/public",
        filename: "dist.js"
    },
    externals: {
	  	jzz: 'JZZ'
	}
};