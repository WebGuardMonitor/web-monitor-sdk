// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const watch = process.env.ROLLUP_WATCH;

export default {
    input: 'src/index.ts',
    output: [
        // 其他输出配置...

        {
            file: 'dist/bundle.js',
            format: 'iife', // 使用 IIFE 输出格式
            // plugins: [terser()],
            globals: {}, // 如果有依赖项也需要暴露为全局变量，可以在这里配置
            name: 'webMonitor', // 设置一个全局变量名，但我们将不使用它
        },
        {
            file: 'dist/bundle.min.js',
            format: 'iife', // 使用 IIFE 输出格式
            plugins: [terser()],
            globals: {}, // 如果有依赖项也需要暴露为全局变量，可以在这里配置
            name: 'webMonitor', // 设置一个全局变量名，但我们将不使用它
        }
    ],
    plugins: [
        typescript({tsconfig: './tsconfig.json'}),
        resolve(),
        commonjs(),
        // watch && livereload('dist')
    ]
};