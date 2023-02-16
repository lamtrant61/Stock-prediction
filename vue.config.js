const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
	// devServer: {
	// 	overlay: false,
	// 	historyApiFallback: true,
	// 	hot: true,
	// },
	devServer: {
	    proxy: "http://localhost:1234"
	},
	productionSourceMap: false,
	transpileDependencies: true
})
