const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const modeConfiguration = env => require(`./webpackMods/webpack.${env}.config.js`)(env);

module.exports = ({ mode } = { mode: 'production' }) => merge({
    mode,
    entry: './src/index.js',
    devServer: {},
    output: {
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.sa?css$/,
                use: [
                    "style-loader", 
                    { 
                        loader  : 'css-loader',
                        options : {
                            modules : true
                        } 
                    }, 
                    "sass-loader"
                ]
            },
            {
                test    : /\.(otf|eot|ttf|ttc|woff|jpe?g|png|gif)$/,
                exclude : /node_modules/,
                use: ["url-loader", "file-loader"]
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template : './public/index.html',
            templateParameters: () => ({
                favicon: "./favicon.ico",
                manifest: "./manifest.json"
            })
        }),
        new Dotenv()
    ]
}, modeConfiguration(mode))