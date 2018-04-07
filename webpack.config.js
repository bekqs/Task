const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isHot = path.basename(require.main.filename) === 'webpack-dev-server.js';

module.exports = {
    devtool: 'cheap-module-eval-source-map',
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
                'style-loader',
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
                        sourceMap: 'inline'
                      }
                }, 
                { 
                    loader: 'sass-loader', 
                    options: { 
                        sourceMap: true 
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
            filename:  "[name].bundle.[chunkhash].css",
            chunkFilename:  "[id].[chunkhash].css"
        })
    ],
    mode: 'development',
    cache: false,
}