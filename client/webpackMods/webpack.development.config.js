const UnusedWebpackPlugin = require('unused-webpack-plugin');
const path = require('path');

module.exports = () => ({
    devtool: "nosources-source-map",
    output: {
        filename: "development.js"
    },
    plugins: [
        new UnusedWebpackPlugin({
            directories: [path.join(__dirname, 'src')]
        })
    ]
});