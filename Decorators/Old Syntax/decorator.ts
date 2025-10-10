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

// 下面是这五种装饰器一起使用的一个示例。
// @ClassDecorator() // （A）
// class A {
//   @PropertyDecorator() // （B）
//   name: string;
//
//   @MethodDecorator() //（C）
//   fly(
//     @ParameterDecorator() // （D）
//     meters: number,
//   ) {
//     // code
//   }
//
//   @AccessorDecorator() // （E）
//   get egg() {
//     // code
//   }
//   set egg(e) {
//     // code
//   }
// }

// 上面示例中，A 是类装饰器，B 是属性装饰器，C 是方法装饰器，D 是参数装饰器，E 是存取器装饰器。
// 注意，构造方法没有方法装饰器，只有参数装饰器。类装饰器其实就是在装饰构造方法。
// 另外，装饰器只能用于类，要么应用于类的整体，要么应用于类的内部成员，不能用于独立的函数。

// 下面示例中，装饰器用于一个普通函数，这是无效的，结果报错。
// function Decorator() {
//   console.log('In Decorator');
// }
//
// //  ERROR: Decorators are not valid here
// @Decorator // 报错
// function decorated() {
//   console.log('in decorated');
// }

// 3. 类装饰器
// 类装饰器应用于类（class），但实际上是应用于类的构造方法。
// 类装饰器有唯一参数，就是构造方法，可以在装饰器内部，对构造方法进行各种改造。如果类装饰器有返回值，就会替换掉原来的构造方法。

// 类装饰器的类型定义如下。
// 下面定义中，类型参数 TFunction 必须是函数，实际上就是构造方法。类装饰器的返回值，要么是返回处理后的原始构造方法，要么返回一个新的构造方法。
type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;

function f(target: any) {
  console.log('apply decorator');
  return target;
}

@f
class A {} // 输出：apply decorator
