var path = require('path');
var srcPath = path.join(__dirname, 'src');
var buildPath = path.join(__dirname, 'dist');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: path.join(srcPath, 'index.html'),
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    devtool: 'source-map',
    context: srcPath,
    entry: path.join(srcPath, 'index.js'),
    output: {
        path: buildPath,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.scss$/,
                include: /src/,
                loaders: ['style', 'css', 'sass']
            }
        ]
    },
    plugins: [HtmlWebpackPluginConfig]
};