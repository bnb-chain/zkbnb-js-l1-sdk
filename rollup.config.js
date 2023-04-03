import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

function resolveWithZksyncCryptoReplace(options) {
  const plugin = resolve(options);
  const defaultPluginResolveId = plugin.resolveId;
  plugin.resolveId = async (source, importer) => defaultPluginResolveId(source, importer);
  return plugin;
}

export default [
  {
    input: 'dist/index.js',
    output: {
      file: 'dist/index.js',
      format: 'iife',
      name: 'zkBNB',
      globals: {
        ethers: 'ethers',
      },
    },
    external: ['ethers'],
    plugins: [
      resolveWithZksyncCryptoReplace({
        browser: true,
      }),
      commonjs(),
      json(),
      terser(),
    ],
  },
];
