import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import babelPluginImport from "babel-plugin-import";

export default {
  input: "src/index.tsx",
  output: {
    file: "dist/index.js",
    format: "esm",
    name: "LFormulaEditor",
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
      antd: "antd",
    },
  },
  external: ["react", "react-dom", "antd"],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      plugins: [
        [
          babelPluginImport,
          {
            libraryName: "antd", // 针对antd实现按需打包
            libraryDirectory: "es", // 指定源码文件夹，默认是lib
            style: true, // 自动打包相关的css
          },
        ],
      ],
    }),
    terser(),
    postcss({
      extensions: [".less"],
      use: [["less", { javascriptEnabled: true }]],
      plugins: [autoprefixer()],
      extract: true,
      minimize: true,
    }),
  ],
};
