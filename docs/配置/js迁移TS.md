## 步骤

1. 将 文件后缀从 js -> ts

2. 配置 tsconfig.json

```js
{
    "compilerOptions": {
        "moduleResolution": "node",
        "target": "es5",
        "module": "es2015",
        "lib": ["es2015", "es2016", "es2017", "dom"],
        "strict": true,
        "sourceMap": true,
        "declaration": true,
        "allowSyntheticDefaultImports": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "declarationDir": "dist/types", // 生成声明文件的输出路径。
        "outDir": "dist/lib", // 生成的所有文件放在built目录下（通过outDir）。
        "typeRoots": ["node_modules/@types"],
        "resolveJsonModule": true,
        "allowJs": true // 接受JavaScript做为输入（通过allowJs）
    },
    "include": ["src"]
}

```

配置 declarationDir 为声明文件的输出路径

3. 配置打包相关的，webpack，rollup

4. 在 package.json 中配置 npm script

## 文档

-   [JavaScript 迁移](https://www.tslang.cn/docs/handbook/migrating-from-javascript.html)
-   [tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
