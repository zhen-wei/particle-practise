import typescript from '@rollup/plugin-typescript';
import { terser } from "rollup-plugin-terser";
export default {
    input: 'script/script.ts',
    output: {
      dir: 'script',
      entryFileNames: '[name].js',
      format: 'esm'
    },
    plugins: [typescript(), terser()]
};