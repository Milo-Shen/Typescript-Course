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

// 2. 装饰器的种类
// 按照所装饰的不同对象，装饰器可以分成五类。
//
// - 类装饰器（Class Decorators）：用于类。
// - 属性装饰器（Property Decorators）：用于属性。
// - 方法装饰器（Method Decorators）：用于方法。
// - 存取器装饰器（Accessor Decorators）：用于类的 set 或 get 方法。
// - 参数装饰器（Parameter Decorators）：用于方法的参数。
