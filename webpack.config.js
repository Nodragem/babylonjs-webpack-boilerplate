const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        // the entry point for your app 'app' is game.ts
        app: './src/game.ts'
    },
    output: {
        // your app 'app' will be bundle in a file app.js in a new folder 'build'
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js' // [name] will be replaced by 'app' 
    },
    resolve: {
        // webpack will search for files with these extensions when it will pack your app:
        extensions: ['.ts', '.tsx', '.js']
    },
    // source maps are useful for debugging
    devtool: 'source-map',

    // you can install many webpack plug-ins, you will set them up here: 
    plugins: [
        // copy-paste index.html and the assets folder to the build folder
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './src/index.html'),
                to: path.resolve(__dirname, 'build')
            },
            {
                from: path.resolve(__dirname, 'assets', '**', '*'),
                to: path.resolve(__dirname, 'build')
            },
            {
                from: path.resolve(__dirname, './shaders/*.*'),
                to: path.resolve(__dirname, 'build'),
                flatten: true
            }
          ])
    ],
     // cut the packaging in 3 chunks (and cache groups) to speed up updading your project in the browser: 
    // - the app chunk: this the code you are writting; it's a small chunk and it is reloaded frequently
    // - the vendor chunk: everything that is in node_modules (e.g. BabylonJS); it's a big chunk and does not need to be reloaded frequently
    // - the default chunk: all modules duplicated in at least 2 chunks
    optimization: {
        splitChunks: {
          chunks: 'all'
        }
    },
    module: {
        // tell webpack what to use to compile typescript (i.e. ts-loader) 
        // and what not to compile (i.e. the folder node_modules)
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                transpileOnly: true 
                // IMPORTANT! use transpileOnly mode to speed-up compilation
                // ALSO very practical when you don't want your build to fail because of typescript errors which aren't detrimental to your javascript.
            }
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            loader: 'file-loader'
        }]
    }
};