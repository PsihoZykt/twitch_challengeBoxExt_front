const fs = require('fs')
const path = require("path")
const webpack = require("webpack")

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, "dist/")

module.exports = (_env, argv) => {
    let entryPoints = {
        Panel: {
            path: "./src/Panel.js",
            outputHtml: "panel.html",
            build: true
        },
    }

    let entry = {}

    // edit webpack plugins here!
    let plugins = [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ]

    for (name in entryPoints) {
        if (entryPoints[name].build) {
            entry[name] = entryPoints[name].path
            if (argv.mode === 'production') {
                plugins.push(new HtmlWebpackPlugin({
                    inject: true,
                    chunks: [name],
                    template: './template.html',
                    filename: entryPoints[name].outputHtml
                }))
            }
        }
    }

    let config = {
        //entry points for webpack- remove if not used/needed
        entry,
        optimization: {
            minimize: false, // this setting is default to false to pass review more easily. you can opt to set this to true to compress the bundles, but also expect an email from the review team to get the full source otherwise.
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true,
                        },
                    }],

                },
                {

                    test: /\.scss$/,
                    use: [
                        "style-loader", // creates style nodes from JS strings
                        "css-loader", // translates CSS into CommonJS
                        "sass-loader", // compiles Sass to CSS, using Node Sass by default

                    ],


                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader: "file-loader",
                    options: {
                        name: "img/[name].[ext]",
                        importLoaders: 1,
                        minimize: true
                    }
                },

            ]
        },
        resolve: {
            extensions: ['*', '.js', '.jsx'],
            fallback: {
                "fs": false,
                "tls": false,
                "net": false,
                "path": false,
                "zlib": false,
                "http": false,
                "https": false,
                "crypto": false,
                "buffer": require.resolve("buffer/"),
                "util": require.resolve("util/"),
                "stream": require.resolve("stream-browserify")



            }
        },
        output: {
            filename: "[name].bundle.js",
            path: bundlePath
        },
        plugins
    }

    if (argv.mode === 'development') {
        config.devServer = {
            // contentBase: path.join(__dirname, 'public'),
            static: './public',
            host: argv.devrig ? 'localhost.rig.twitch.tv' : 'localhost',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            port: 8080
        }
        config.devServer.https = true
    }
    if (argv.mode === 'production') {
        config.optimization.splitChunks = {
            cacheGroups: {
                default: false,
                vendors: false,
                vendor: {
                    chunks: 'all',
                    test: /node_modules/,
                    name: false
                }
            },
            name: false
        }
    }

    return config;
}