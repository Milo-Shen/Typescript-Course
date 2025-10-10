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

// 下面示例中，使用了装饰器@f，因此类A的构造方法会自动传入 f。
// 类A不需要新建实例，装饰器也会执行。装饰器会在代码加载阶段执行，而不是在运行时执行，而且只会执行一次。
// 由于 TypeScript 存在编译阶段，所以装饰器对类的行为的改变，实际上发生在编译阶段。这意味着，TypeScript 装饰器能在编译阶段运行代码，也就是说，它本质就是编译时执行的函数。
function f(target: any) {
  console.log('apply decorator');
  return target;
}

@f
class A {} // 输出：apply decorator
// 上面示例中，使用了装饰器@f，因此类A的构造方法会自动传入 f。
// 类 A 不需要新建实例，装饰器也会执行。装饰器会在代码加载阶段执行，而不是在运行时执行，而且只会执行一次。
// 由于 TypeScript 存在编译阶段，所以装饰器对类的行为的改变，实际上发生在编译阶段。这意味着，TypeScript 装饰器能在编译阶段运行代码，也就是说，它本质就是编译时执行的函数。

// 下面再看一个示例。
// 装饰器 @sealed() 会锁定BugReport这个类，使得它无法新增或删除静态成员和实例成员。
@sealed
class BugReport {
  type = 'report';
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

function sealed(constructor: Function) {
  console.log(`class ${constructor.name} is sealed`);
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

// 如果除了构造方法，类装饰器还需要其他参数，可以采取“工厂模式”，即把装饰器写在一个函数里面，该函数可以接受其他参数，执行后返回装饰器。但是，这样就需要调用装饰器的时候，先执行一次工厂函数。
// 上面示例中，函数 factory() 的返回值才是装饰器，所以加载装饰器的时候，要先执行一次 @factory('log something')，才能得到装饰器。这样做的好处是，可以加入额外的参数，本例是参数 info。
function factory(info: string) {
  console.log('received: ', info);
  return function (target: any) {
    console.log('apply decorator to: ', target);
    return target;
  };
}

@factory('log something')
class A1 {}

// 总之，@ 后面要么是一个函数名，要么是函数表达式，甚至可以写出下面这样的代码。
// 下面示例中，@后面是一个箭头函数，这也是合法的。
@((constructor: Function) => {
  console.log('log something: ', constructor);
})
class InlineDecoratorExample {
  // ...
}

// 类装饰器可以没有返回值，如果有返回值，就会替代所装饰的类的构造函数。由于 JavaScript 的类等同于构造函数的语法糖，所以装饰器通常返回一个新的类，对原有的类进行修改或扩展。
function decorator(target: any) {
  return class extends target {
    value = 123;
  };
}

@decorator
class Foo {
  value = 456;
}

const foo = new Foo();
console.log('foo.value : ', foo.value); // 123

// 上面示例中，装饰器 decorator 返回一个新的类，替代了原来的类。
// 上例的装饰器参数 target 类型是 any，可以改成构造方法，这样就更准确了。
type Constructor = {
  new (...args: any[]): {};
};

function decorator1<T extends Constructor>(target: T) {
  return class extends target {
    value = 123;
  };
}

@decorator1
class Foo1 {
  value = 456;
}

// 这时，装饰器的行为就是下面这样。
// 下面代码中，装饰器要么返回一个新的类 A，要么不返回任何值，A 保持装饰器处理后的状态。

// @decorator
// class A {}
//
// // 等同于
// class A {}
// A = decorator(A) || A;

// 4. 方法装饰器
// 方法装饰器用来装饰类的方法，它的类型定义如下。
type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

// 方法装饰器一共可以接受三个参数。
// 1. target：（对于类的静态方法）类的构造函数，或者（对于类的实例方法）类的原型。
// 2. propertyKey：所装饰方法的方法名，类型为 string|symbol。
// 3. descriptor：所装饰方法的描述对象。

// 方法装饰器的返回值（如果有的话），就是修改后的该方法的描述对象，可以覆盖原始方法的描述对象。
// 下面是一个示例。
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('target === Greeter.prototype : ', target === Greeter.prototype);
    console.log('[method decorator] target:', target, '; propertyKey:', propertyKey, '; descriptor:', descriptor);
    descriptor.enumerable = value;
  };
}

function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('target === Greeter : ', target === Greeter);
    console.log('[static method decorator] target:', target, '; propertyKey:', propertyKey, '; descriptor:', descriptor);
    descriptor.configurable = value;
  };
}

class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  @configurable(true)
  static Hi() {
    return 'Hi';
  }

  @enumerable(true)
  greet() {
    return 'Hello, ' + this.greeting;
  }
}

// 上面示例中，方法装饰器 @enumerable() 装饰 Greeter 类的 greet() 方法，作用是修改该方法的描述对象的可遍历性属性 enumerable。
// @enumerable(true) 表示将该方法修改成可遍历。
console.log("Reflect.getOwnPropertyDescriptor(Greeter.prototype, 'greet') : ", Reflect.getOwnPropertyDescriptor(Greeter.prototype, 'greet'));

// 下面再看一个例子。
