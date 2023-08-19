const MiniCssExtractPlugin   = require("mini-css-extract-plugin");
const CssMinimizerPlugin     = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin           = require('terser-webpack-plugin');
const WorkboxPlugin          = require('workbox-webpack-plugin');

module.exports = () => ({
    devtool : 'eval-source-map',
    output: {
        filename: "production.js"
    },
    optimization: {
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin()
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        }),
        new MiniCssExtractPlugin()
    ]
});