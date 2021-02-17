const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@framework': path.resolve(__dirname, 'src/SDKv4/Framework/src')
        }
    },
    plugins: [
        new CompressionPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            compressionOptions: {level: 11},
            threshold: 4096,
            minRatio: 1
        }),
        new CompressionPlugin({
            filename: "[path][base].gz",
            algorithm: "gzip",
            compressionOptions: {level: 9},
            threshold: 4096,
            minRatio: 1,
        }),
    ],
    entry: ['./src/SDKv4/main.ts', './src/SDKv2/mainV2.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'live2d_bundle.js',
        publicPath: './dist/'
    },
    devServer: {
        contentBase: path.resolve(__dirname, '.'),
        watchContentBase: true,
        inline: true,
        hot: true,
        port: 5001,
        host: '0.0.0.0',
        compress: true,
        useLocalIp: true,
        writeToDisk: true
    },
}
