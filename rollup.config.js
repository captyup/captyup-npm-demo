import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json'));

const copyPlugin = copy({
  targets: [
    { src: 'src/index.d.ts', dest: 'dist' }
  ]
});

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.browser.js',
        format: 'umd',
        name: 'captyupNpmDemo',
        sourcemap: true
      },
      {
        file: 'dist/index.browser.min.js',
        format: 'umd',
        name: 'captyupNpmDemo',
        plugins: [terser()],
        sourcemap: true
      }
    ],
    plugins: [
      resolve({
        browser: true
      }),
      commonjs(),
      copyPlugin
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true
      }
    ],
    external: Object.keys(pkg.dependencies || {}),
    plugins: [
      resolve(),
      commonjs()
    ]
  }
];