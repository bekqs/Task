const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-eval-source-map', // Not working with Babel
    entry: ['babel-polyfill', './src/app.js'],
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['env', 'stage-0']
            }
        },
        {
            test: /\.scss?$/,
            loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        }]
    },
    devServer: {
        hot: true,
        open: true,
        compress: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    mode: 'development'
}