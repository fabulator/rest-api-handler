import babel from 'rollup-plugin-babel';
import packpage from './package.json';
import fs from 'fs';

const baseSettings = {
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
                'external-helpers',
                'transform-class-properties',
                'transform-object-rest-spread',
            ],
        }),
    ],
    treeshake: {
        propertyReadSideEffects: false,
    },
};

fs.copyFile('./src/index.js', 'dist/rest-api-handler.js.flow', () => {});

export default [
    Object.assign({}, baseSettings, {
        input: './src/index.js',
        output: [
            {
                file: 'dist/rest-api-handler.es.js',
                format: 'es',
            }, {
                file: 'dist/rest-api-handler.js',
                format: 'umd',
                name: 'apiHandler',
            },
        ],
    }),
].concat(
    [
        'Api',
        'DefaultResponseProcessor',
        'DefaultApiException',
        'resolveProcessors',
        'dataFormats',
        'dataFormats',
        'responseProcessor',
    ].map((file) => {
        return Object.assign({}, baseSettings, {
            input: `./src/${file}.js`,
            output: {
                file: `dist/${file}.js`,
                format: 'cjs',
            },
            plugins: baseSettings.plugins.concat([
                {
                    name: 'on-generate',
                    ongenerate: () => {
                        fs.copyFile(`./src/${file}.js`, `dist/${file}.js.flow`, () => {});
                    },
                },
            ]),
        });
    }),
);
