import copy from 'rollup-plugin-copy';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'umd',
        name: 'captyup-npm-demo'
    },
    plugins: [
        copy({
            targets: [
                { src: 'src/index.d.ts', dest: 'dist' }
            ]
        })
    ]
};