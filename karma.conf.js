const packpage = require('./package.json');

module.exports = (config) => {
    config.set({
        preprocessors: {
            'test/**/*.test.js': ['babel', 'commonjs'],
            'src/**/*.js': ['babel', 'commonjs'],
        },
        coverageReporter: {
            type: 'html',
            reporters: [
                { type: 'cobertura', dir: './test_results/coverage/cobertura', subdir: '.' },
                { type: 'html', dir: './test_results/coverage/html', subdir: '.' },
                { type: 'lcov', dir: './test_results/coverage/lcov', subdir: '.' },
                { type: 'json', dir: './test_results/coverage/json', subdir: '.' },
                { type: 'text' },
            ],
        },
        babelPreprocessor: {
            options: {
                presets: [
                    [
                        'env',
                        {
                            targets: {
                                browsers: packpage.browserslist,
                                node: '9.6.1',
                            },
                        },
                    ],
                    'flow',
                ],
                plugins: [
                    'istanbul',
                    'transform-class-properties',
                    'transform-object-rest-spread',
                ],
            },
        },
        plugins: [
            'karma-coverage',
            'karma-junit-reporter',
            'karma-babel-preprocessor',
            'karma-commonjs',
            'karma-jasmine',
            'karma-chrome-launcher',
        ],
        basePath: '',
        frameworks: ['jasmine', 'commonjs'],
        files: [
            { pattern: 'src/**/*.js' },
            { pattern: 'test/**/*.test.js' },
        ],
        reporters: [
            'progress',
            'junit',
            'coverage',
        ],
        junitReporter: {
            outputDir: './test_results/unit',
            outputFile: 'test.xml',
            useBrowserName: false,
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['ChromeHeadless'],
        singleRun: true,
        concurrency: Infinity,
    });
};
