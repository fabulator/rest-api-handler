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
                            node: '9.6.1',
                        },
                    },
                ],
                'flow',
            ],
            plugins: [
                'external-helpers',
                [
                    'transform-builtin-classes', {
                        globals: ['Error'],
                    },
                ],
                'transform-class-properties',
                'transform-object-rest-spread',
            ],
        }),
    ],
    treeshake: {
        propertyReadSideEffects: false,
    },
};

fs.copyFile('./src/index.js', 'dist/index.js.flow', () => {});

export default [
    Object.assign({}, baseSettings, {
        input: './src/index.js',
        output: [
            {
                file: 'dist/index.es.js',
                format: 'es',
            }, {
                file: 'dist/index.js',
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
        'responseProcessor',
        'ApiExceptionInterface',
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
