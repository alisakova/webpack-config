const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const getOptimizationConfig = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
};

const getFileName = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const getCssLoaders = additionalLoader => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader, // extracts CSS into separate files
            options: {
                hmr: isDev,
                reloadAll: true,
            }
        },
        'css-loader'
    ]; // webpack goes from right to left

    if (additionalLoader) {
        loaders.push(additionalLoader);
    }

    return loaders;
};

const getBabelOptions = additionalPreset => {
    const options = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    };

    if (additionalPreset) {
        options.presets.push(additionalPreset);
    }

    return options;
};

const getJsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: getBabelOptions()
    }];

    if (isDev) {
        loaders.push('eslint-loader');
    }

    return loaders;
};

const getCommonPlugins = () => {
    const basePlugins = [
        new CleanWebpackPlugin(), // clean dist folder
        new HTMLWebpackPlugin({
            template: './index.html', // use './src/index.html' if context isn't specified
            minify: isProd,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: getFileName('css')
        })
    ];

    if (isProd) {
        basePlugins.push(new BundleAnalyzerPlugin());
    }

    return basePlugins;
};

module.exports = {
    context: path.resolve(__dirname, 'src'), // folder, where all assets are placed, not required, by default it's src
    mode: 'development',
    entry: { // entry file(s) for app
        main: ['@babel/polyfill', './index.jsx'], // use './src/index.js' if context isn't specified
        analytics: './analytics.ts', // use './src/analytics.js' if context isn't specified
    },
    devServer: {
        port: '3000',
        hot: isDev,
    },
    output: {
        // build file name, [name] is a substitution (pattern) to ensure that each entry file has a unique name
        // [contenthash] - to avoid cache
        filename: getFileName('js'),
        path: path.resolve(__dirname, 'dist'), // build folder
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
        }
    },
    optimization: getOptimizationConfig(),
    devtool: isDev ? 'source-map' : '',
    plugins: getCommonPlugins(),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: getJsLoaders(),
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: getBabelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: getBabelOptions('@babel/preset-react')
                }
            },
            {
                test: /\.css$/,
                use: getCssLoaders(),
            },
            {
                test: /\.s[ac]ss$/,
                use: getCssLoaders('sass-loader'),
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                loader: 'file-loader'
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                loader: 'file-loader'
            }
        ]
    }
};
