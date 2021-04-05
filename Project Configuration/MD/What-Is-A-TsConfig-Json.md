# 什么是 tsconfig 文件

## 概述
`tsconfig.json` 文件的存在表明了当前目录是一个 TypeScript 项目的根目录。`tsconfig.json` 文件指定编译项目所需的根文件和编译器选项。
  
`JavaScript` 项目可以使用 `jsconfig.json` 文件来替代，其行为与 `tsconfig.json` 文件几乎相同，但是含有一些默认开启的与 Javascript 相关的编译器标志。  

一个项目可以以以下的任意一种方式编译:

## 使用 `tsconfig.json` 文件或是 `jsconfig.json` 文件
+ 不带任何输入文件的情况下调用 `tsc` 命令，编译器会从当前目录开始去查找 `tsconfig.json` 文件，逐级向上搜索父目录
+ 调用 `tsc` 命令，该命令不带输入文件，但有一个 `--project` ( 或 `-p` ) 命令选项，该选项指定包含一个 `tsconfig.json` 配置文件，或是带有配置文件的有效的 json 文件的路径  
+ 不带任何输入文件的情况下调用 `tsc` 命令，且使用命令行参数 `--project`（ 或 `-p` ）指定一个包含 `tsconfig.json` 文件的目录。
+ 当在命令行上指定输入文件时，`tsconfig.json` 文件将被忽略。 ( experiment )

## Examples
Example `tsconfig.json` files:

+ Using the `include ` property

```
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true
  },
  "files": [
    "core.ts",
    "sys.ts",
    "types.ts",
    "scanner.ts",
    "parser.ts",
    "utilities.ts",
    "binder.ts",
    "checker.ts",
    "emitter.ts",
    "program.ts",
    "commandLineParser.ts",
    "tsc.ts",
    "diagnosticInformationMap.generated.ts"
  ]
}
```

+ Using the `include` and `exclude` properties

```
{
  "compilerOptions": {
    "module": "system",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "outFile": "../../built/local/tsc.js",
    "sourceMap": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}
```

## TSConfig Bases
[https://github.com/tsconfig/bases/](https://github.com/tsconfig/bases/) 这个站点中提供了运行 JavaScript 运行时所需要的基本配置。  
您的项目可以通过扩展上述 `tsconfig.json` 配置文件，处理运行时支持来简化项目本身的 `tsconfig.json` 配置。  

例如，如果你正在编写一个使用Node.js 12及以上版本的项目，那么你可以使用 npm 模块 [@tsconfig/node12](https://www.npmjs.com/package/@tsconfig/node12):

```
{
  "extends": "@tsconfig/node12/tsconfig.json",
  "compilerOptions": {
    "preserveConstEnums": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.ts"
  ]
}
```

 [@tsconfig/node12](https://www.npmjs.com/package/@tsconfig/node12) 的内容:
 
```
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Node 12",

  "compilerOptions": {
    "lib": ["es2019", "es2020.promise", "es2020.bigint", "es2020.string"],
    "module": "commonjs",
    "target": "es2019",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }  
}
```
通过使用 TSConfig Bases 可以使您的 `tsconfig.json` 文件只需要关心项目的专属配置，而不是所有的运行时配置机制。我们已经为您提供了一些基础的 TSConfig Bases 配置，并希望社区能够为不同的环境添加更多的 TSConfig 配置

+ [Recommended](https://www.npmjs.com/package/@tsconfig/recommended)
+ [Node 10](https://www.npmjs.com/package/@tsconfig/node10)
+ [Node 12](https://www.npmjs.com/package/@tsconfig/node12)
+ [Node 14](https://www.npmjs.com/package/@tsconfig/node14)
+ [Deno](https://www.npmjs.com/package/@tsconfig/deno)
+ [React Native](https://www.npmjs.com/package/@tsconfig/react-native)
+ [Svelte](https://www.npmjs.com/package/@tsconfig/svelte)

## 细节
`compilerOptions ` 可以被忽略，这时编译器会使用默认值。在这里查看完整的[编译器选项列表](https://www.typescriptlang.org/tsconfig)。