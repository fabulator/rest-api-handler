import babel from 'rollup-plugin-babel';
import packpage from './package.json';

export default {
    input: './src/index.js',
    output: [ {
        file: 'dist/api-handler.es.js',
        format: 'es',
    }, {
        file: 'dist/api-handler.js',
        format: 'umd',
        name: 'apiHandler',
    } ],
    treeshake: {
        propertyReadSideEffects: false,
    },
    plugins: [
        babel({
            presets: [
                [
                    'env',
                    {
                        modules: false,
                        targets: {
                            browsers: packpage.browserslist,
                        },
                    },
                ],
                'flow',
            ],
            plugins: [
                'transform-object-rest-spread',
            ],
        }),
    ],
};
