const path = require('path')
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const moment = require('moment-timezone');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// function resolve(dir) {
//     return path.relative('node_modules', path.join(__dirname, '..', dir))
// }

// console.log(resolve('node_modules'))

let banner = 'Webpack build information: ' +
    '\n' + moment().tz("America/Chicago").format("dddd, MMMM Do YYYY, h:mm:ss a") +
    '\nhttps://github.com/ICJIA/icjia-fusioncharts-webpack-vue-injection' +
    '\nARI Map Injection Test' +
    '\ncja.irc@illinois.gov'

module.exports = {
    entry: './_vue/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: './js/[name].js',
        chunkFilename: '[name]-chunk.js',
    },
    module: {
        loaders: [

            {
                test: /moment\.js$/,
                loader: "expose-loader?moment"
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?.*$|$)/,
                loader: 'file-loader'
            },

            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(sass|scss|css)$/,
                loader: ExtractTextPlugin.extract({ fallback: "style-loader", use: 'css-loader!sass-loader' })
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader',
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    },
                    extractCSS: true
                }
            }

        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery-slim',
            jQuery: 'jquery-slim',
            'window.jQuery': 'jquery-slim',
            Popper: ['popper.js', 'default'],

        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, './static'),
            to: 'static',
            ignore: ['.*']
        }]),
        new ExtractTextPlugin({
            filename: './css/app.css',
            allChunks: true
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     children: true,
        //     // (use all children of the chunk)

        //     async: 'common',
        //     // (create an async commons chunk)

        //     minChunks: 3,
        //     // (3 children must share the module before it's separated)
        // }),
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
            'vue$': 'vue/dist/vue.esm.js',
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
                    // drop_console: true
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

if (process.env.REPORT_ENV === 'report') {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new BundleAnalyzerPlugin()
    ])
}