import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'dist/index.js',
    output: {
      file: './dist/index.js',
      format: 'iife',
      name: 'zkBNB',
      globals: {
        ethers: 'ethers',
      },
    },
    external: ['ethers'],
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      json(),
      terser(),
    ],
  },
];
