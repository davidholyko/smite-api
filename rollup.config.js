const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const typescript = require('rollup-plugin-typescript2');
const json = require('@rollup/plugin-json');

module.exports = {
  input: 'src/index.ts', // Specify the entry point of your application
  output: {
    dir: 'dist', // Specify the output directory for the bundled files
    format: 'cjs',
    exports: 'named',
  },
  plugins: [nodeResolve(), commonjs(), typescript(), terser(), json()],
  external: [
    'path', // Add any external modules you want to exclude from the bundle
  ],
};
