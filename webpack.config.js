var path = require('path')
var webpack = require('webpack')


var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    watch: true,

    context: __dirname + '/src',

    entry: {
        "App": './js/App.js',
    },

    output: {
        path: path.resolve(__dirname, './dist/assets'),
        publicPath: '/assets/',
        filename: '[name].js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css')
    ],

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': [
                            {loader: 'style-loader'},
                            {loader: 'css-loader'},
                            {loader: "sass-loader"},
                        ],
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            },

            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015']
                }
            },

            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[path]/images/[name].[ext]'
                }
            },

            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[path]/[name].[ext]'
                }
            },

            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                })
            },

            {
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader'
                    ]
                })
            }
        ]
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve('./src/js'),
            // '@p': path.resolve('./src/public/js'),
            //'jquery': 'jquery/src/jquery.js'
        }
    },

    node: {
        fs: 'empty'
    },

    devServer: {
        historyApiFallback: true,
        noInfo: true
    },

    performance: {
        hints: false
    },

    devtool: '#eval',
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
