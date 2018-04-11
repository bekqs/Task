const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// These plugins were causing the problem, seems to be working now
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isHot = path.basename(require.main.filename) === 'webpack-dev-server.js';

module.exports = {
    devtool: 'source-map',
    entry: ['babel-polyfill', './src/app.js'],
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'app.bundle.js',
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
            test: /\.(scss|css)$/,
            use: [
                'css-hot-loader',
                MiniCssExtractPlugin.loader,
                { 
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        minimize: {
                            safe: true
                        }
                    }
                }, 
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                }, 
                { 
                    loader: 'sass-loader', 
                    options: { 
                        sourceMap: true,
                    } 
                }
            ]
        }]
    },
    devServer: {
        hot: true,
        open: true,
        compress: true
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new UglifyJsPlugin(),
        new MiniCssExtractPlugin({
            filename:  "[name].css",
            chunkFilename:  "[id].css"
        })
    ],
    mode: 'development',
}