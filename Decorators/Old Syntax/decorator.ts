// 1. experimentalDecorators 编译选项
// $ tsc --target ES5 --experimentalDecorators
// 此外，还有另外一个编译选项--emitDecoratorMetadata，用来产生一些装饰器的元数据，供其他工具或某些模块（比如 reflect-metadata ）使用。
// 这两个编译选项可以在命令行设置，也可以在tsconfig.json文件里面进行设置。

// {
//   "compilerOptions": {
//   "target": "ES6",
//     "experimentalDecorators": true,
//     "emitDecoratorMetadata": true
// }
// }
