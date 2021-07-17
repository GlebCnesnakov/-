const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpuckPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPLugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const loader = require('sass-loader')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const Pluginki = (one, two) => {
    const ohok = new HTMLWebpackPlugin({filename: one, template: path.join(__dirname, two), minify: {collapseWhitespace: isProd}})

    return ohok
}


const optimization = () => {
    const config ={
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsPLugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}

const cssLoader = extra => {
    const loaders = [MiniCssExtractPlugin.loader, 'css-loader']
    if (extra) {
        loaders.push(extra)
    }
    return loaders
}

module.exports = {
// здесь могла бы быть ваша context
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './src/index.js']
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: optimization(), //про вендоры, упростить задачу
    devServer: {  //хуита для сразу отображать в тырн
        port: 4200,
        hot: isDev
    },
    plugins: [
        Pluginki('header.html', './src/pug/pages/limbs/header.pug'),
        Pluginki('footer.html', './src/pug/pages/limbs/footer.pug'),
        Pluginki('layout.html', './src/pug/pages/layout/layout.pug'),
        Pluginki('lendingpage.html', './src/pug/pages/lendingpage.pug'),
        Pluginki('index.html', './src/pug/pages/layout/index.pug'),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ],
    module: {  // лоадеры
        rules: [
            {
                test: /\.scss$/,
                use: cssLoader('sass-loader')
            },
            {
                test: /\.css$/,
                use: cssLoader()
            },
            {
                test: /\.pug$/,
                use: ['pug-loader']
            },
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|ttf|woff2|svg)$/,
                use: ['file-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                    presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}