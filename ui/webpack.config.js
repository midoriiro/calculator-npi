const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let baseEnv = { ...process.env };

const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log(`Loading environment from .env`);
    const fileEnv = dotenv.config({ path: envPath });
    const expandedEnv = dotenvExpand.expand(fileEnv).parsed || {};
    baseEnv = { ...baseEnv, ...expandedEnv };
} else {
    console.warn(`.env not found, using process.env`);
}

const envKeys = Object.keys(baseEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(baseEnv[next]);
    return prev;
}, {});

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            process: "process/browser"
        },
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new webpack.DefinePlugin(envKeys),
    ],
};