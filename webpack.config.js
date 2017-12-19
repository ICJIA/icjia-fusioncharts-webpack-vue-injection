const path = require('path')
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const moment = require('moment-timezone');

let banner = 'Webpack build information: ' +
    '\n' + moment().tz("America/Chicago").format("dddd, MMMM Do YYYY, h:mm:ss a") +
    '\nhttps://github.com/ICJIA/' +
    '\nARI Map Injection Test' +
    '\ncja.info@illinois.gov'

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name]-chunk.js',
    },
    module: {
        rules: [{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader"
                })
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: 'css-loader',
                            fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
                        }),
                        scss: ExtractTextPlugin.extract({
                            use: 'css-loader!sass-loader',
                            fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
                        }),

                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
                loader: 'file-loader'
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default'],

        }),

        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, './static'),
            to: 'static',
            ignore: ['.*']
        }]),
        new ExtractTextPlugin("app.css"),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks(module, count) {
                var context = module.context;
                return context && context.indexOf('node_modules') >= 0;
            },
        }),
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json'],
        modules: [
            path.resolve('./'),
            path.resolve('./node_modules'),
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
        // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),

        // new CompressionPlugin({
        //     algorithm: 'gzip',
        //     exclude: /\/static/
        // }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        }),
        new CleanWebpackPlugin(path.resolve(__dirname, './dist')),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    //drop_console: true
                }
            },
            sourceMap: true,
            parallel: true
        }),
        new webpack.BannerPlugin({
            banner: banner + "\nname:[name]\nfilebase:[filebase]\nfile:[file]",
            entryOnly: true,
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}