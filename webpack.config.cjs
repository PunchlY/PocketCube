const { resolve } = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
    experiments: {
        outputModule: true,
        topLevelAwait: true,
    },
    entry: {
        'PocketCube.min.mjs': resolve(__dirname, 'build/index.js'),
        'PocketCube.solve.min.mjs': resolve(__dirname, 'build/solve.js'),
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: '[name]',
        library: {
            type: 'module',
        },
    },
    optimization: {
        minimize: false,
        chunkIds: 'deterministic',
        providedExports: true,
        usedExports: true,
        sideEffects: false,
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /solvedata\.json$/,
                type: 'javascript/auto',
                use: [resolve(__dirname, 'solvedata.json-loader.cjs')],
            },
        ],
    },
};
