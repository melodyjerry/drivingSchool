const path = require('path'),
	webpack = require('webpack'),
	htmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	CleanWebpackPlugin = require('clean-webpack-plugin'),
	config = require('./config'),
	HTMLPlugins = [],
	Entries = {}
config.HTMLDirs.forEach(page => {
	const htmlPlugin = new htmlWebpackPlugin({
		filename: `${page}.html`,
		template: path.resolve(__dirname, `${config.templatePath}${page}.ejs`),
		inject: 'body',
		title: '驾校管理系统',
		chunks: ['common', page],
		minify: {
			removeComments: true,
			collapseWhitespace: true,
			removeRedundantAttributes: true,
			useShortDoctype: true,
			removeEmptyAttributes: true,
			removeStyleLinkTypeAttributes: true,
			keepClosingSlash: true,
			minifyJS: true,
			minifyCSS: true,
			minifyURLs: true
		}
	})
	HTMLPlugins.push(htmlPlugin)
	Entries[page] = path.resolve(__dirname, `${config.jsEntryPath}${page}.js`)
})

module.exports = {
	entry: Entries,

	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, config.outputPath)
	},

	devtool: 'eval-source-map',
	resolve: {
		extensions: ['.js', '.html', '.css', '.txt', '.less', '.ejs', '.json'],
		alias: {
			mainStyle: path.resolve(__dirname, '../drivingSchool/UI/style/main'),
			formStyle: path.resolve(__dirname, '../drivingSchool/UI/style/form'),
			js: path.resolve(__dirname, '../drivingSchool/BLL/js/component')
		}
	},
	module: {
		rules: [
			{
				test: /\.(less|css)?$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								minimize: true
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: loader => [
									require('postcss-import')({
										addDependencyTo: webpack
									}),
									require('postcss-cssnext')(),
									require('autoprefixer')({
										broswers: ['last 5 versions']
									}),
									require('cssnano')()
								]
							}
						},
						{
							loader: 'less-loader'
						}
					]
				}),
				exclude: path.resolve(__dirname, '../node_modules'),
				include: path.resolve(__dirname, '../drivingSchool/UI/style')
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: path.resolve(__dirname, '../node_modules'),
				include: path.resolve(__dirname, '../drivingSchool/BLL/js'),
				options: {
					presets: ['latest']
				}
			},
			{
				test: /\.ejs$/,
				loader: 'ejs-compiled-loader',
				include: path.resolve(__dirname, '../drivingSchool/UI'),
				exclude: path.resolve(__dirname, '../node_modules')
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|cur|ico)$/i,
				use: {
					loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
					options: {
						publicPath: '/'
					}
				}
			},
			{
				test: require.resolve('jquery'), // 此loader配置项的目标是NPM中的jquery
				loader: 'expose-loader?$!expose-loader?jQuery' // 先把jQuery对象声明成为全局变量`jQuery`，再通过管道进一步又声明成为全局变量`$`
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['public'], {
			dry: true
		}),
		new ExtractTextPlugin('css/[name].css'),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	}
		// }),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			filename: '[name].js'
		}),
		...HTMLPlugins,
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			'window.$': 'jquery'
		})
	]
}
