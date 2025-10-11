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
function logger(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log('params: ', ...args);
    const result = original.call(this, ...args);
    console.log('result: ', result);
    return result;
  };
}

// 下面示例中，方法装饰器 @logger 用来装饰 add() 方法，它的作用是让该方法输出日志。每当 add() 调用一次，控制台就会打印出参数和运行结果。
class C {
  @logger
  add(x: number, y: number) {
    return x + y;
  }
}

// params:  1 2
// result:  3
new C().add(1, 2);

// 5. 属性装饰器
// 属性装饰器用来装饰属性，类型定义如下。
type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;

// 属性装饰器函数接受两个参数
// 1. target：（对于实例属性）类的原型对象（prototype），或者（对于静态属性）类的构造函数。
// 2. propertyKey：所装饰属性的属性名，注意类型有可能是字符串，也有可能是 Symbol 值。

// 属性装饰器不需要返回值，如果有的话，也会被忽略。
// 下面是一个示例。
function ValidRange(min: number, max: number) {
  return (target: Object, key: string) => {
    Object.defineProperty(target, key, {
      set: function (v: number) {
        if (v < min || v > max) {
          throw new Error(`Not allowed value ${v}`);
        }
      },
    });
  };
}

// 输出 Installing ValidRange on year
class Student {
  @ValidRange(1920, 2020)
  year!: number;
}

const stud = new Student();
// todo: 这句话教材上说的不对，需要继续深入研究
// 结论: 只有 compilerOptions 下的 target 设置为 ES5 或是 ES6 的时候，属性装饰器才会生效
// stud.year = 2022;
stud.year = 1921;

// // 报错 Not allowed value 2022
// Student.prototype.year = 2022;
console.log('Student.prototype.year : ', Student.prototype.year);

// 注意，属性装饰器的第一个参数，对于实例属性是类的原型对象，而不是实例对象（ 即不是 this 对象 ）。这是因为装饰器执行时，类还没有新建实例，所以实例对象不存在。
// 由于拿不到 this，所以属性装饰器无法获得实例属性的值。这也是它没有在参数里面提供属性描述对象的原因。
function logProperty(target: Object, member: string) {
  const prop = Object.getOwnPropertyDescriptor(target, member);
  // 输出 Property name undefined
  console.log(`Property ${member}: `, prop);
  console.log('target === PropertyExample.prototype : ', target === PropertyExample.prototype);
}

// 下面示例中，属性装饰器 @logProperty 内部想要获取实例属性 name 的属性描述对象，结果拿到的是 undefined。
// 因为上例的 target 是类的原型对象，不是实例对象，所以拿不到 name 属性，也就是说 target.name 是不存在的，所以拿到的是 undefined。只有通过 this.name 才能拿到 name 属性，但是这时 this 还不存在。
class PropertyExample {
  @logProperty
  name: string = 'Foo';
}

// 属性装饰器不仅无法获得实例属性的值，也不能初始化或修改实例属性，而且它的返回值也会被忽略。因此，它的作用很有限。
// 不过，如果属性装饰器设置了当前属性的存取器（ getter / setter ），然后在构造函数里面就可以对实例属性进行读写。
// 下面示例中，属性装饰器@Min通过设置存取器，拿到了实例属性的值
function Min(limit: number) {
  return function (target: Object, propertyKey: string) {
    let value: string;

    const getter = function () {
      return value;
    };

    const setter = function (newVal: string) {
      if (newVal.length < limit) {
        throw new Error(`Your password should be bigger than ${limit}`);
      } else {
        value = newVal;
      }
    };

    Reflect.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
    });
  };
}

class User {
  username: string;

  @Min(8)
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

// 报错 Your password should be bigger than 8
// todo: 实际这块的代码，也没有生效，需要找到原因
// 结论: 只有 compilerOptions 下的 target 设置为 ES5 或是 ES6 的时候，属性装饰器才会生效
const u = new User('Foo', '123456789');

// 6. 存取器装饰器
// 存取器装饰器用来装饰类的存取器（accessor）。所谓“存取器”指的是某个属性的取值器（getter）和存值器（setter）。
// 存取器装饰器的类型定义，与方法装饰器一致。
type AccessorDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

// 存取器装饰器有三个参数。
// target：（ 对于静态属性的存取器 ）类的构造函数，或者（ 对于实例属性的存取器 ）类的原型对象。
// propertyKey：存取器的属性名。
// descriptor：存取器的属性描述对象。

// 存取器装饰器的返回值（如果有的话），会作为该属性新的描述对象。
// 下面是一个示例。
function configurable1(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('target === Point.prototype : ', target === Point.prototype);
    descriptor.configurable = value;
  };
}

// 下面示例中，装饰器 @configurable(false) 关闭了所装饰属性（ x 和 y ）的属性描述对象的 configurable 键（ 即关闭了属性的可配置性 ）。
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable1(false)
  get x() {
    return this._x;
  }

  @configurable1(false)
  get y() {
    return this._y;
  }
}

// 下面的示例是将装饰器用来验证属性值，如果赋值不满足条件就报错。
function validator(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalSet = descriptor.set;
  if (originalSet) {
    descriptor.set = function (val) {
      if (val > 100) {
        throw new Error(`Invalid value for ${propertyKey}`);
      }
      originalSet.call(this, val);
    };
  }
}

class C1 {
  #foo!: number;

  @validator
  set foo(v) {
    this.#foo = v;
  }

  // @validator // TS1207: Decorators cannot be applied to multiple get/set accessors of the same name.
  get foo() {
    return this.#foo;
  }
}

// 下面示例中，装饰器用自己定义的存值器，取代了原来的存值器，加入了验证条件。
// Important TypeScript 不允许对同一个属性的存取器（ getter 和 setter ）使用同一个装饰器，也就是说只能装饰两个存取器里面的一个，且必须是排在前面的那一个，否则报错。
const c1 = new C1();
// c1.foo = 150; // 报错
// 装饰器之所以不能同时用于同一个属性的存值器和取值器，原因是装饰器可以从属性描述对象上面，同时拿到取值器和存值器，因此只调用一次就够了。

// 7. 参数装饰器
// 参数装饰器用来装饰构造方法或者其他方法的参数。它的类型定义如下。
type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;

// 参数装饰器接受三个参数。
// target：（ 对于静态方法 ）类的构造函数，或者（ 对于类的实例方法 ）类的原型对象。
// propertyKey：所装饰的方法的名字，类型为 string|symbol。
// parameterIndex：当前参数在方法的参数序列的位置（ 从 0 开始 ）。

// 该装饰器不需要返回值，如果有的话会被忽略。
// 下面是一个示例。
function log(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  console.log(`${String(propertyKey)} NO.${parameterIndex} Parameter`);
}

class C2 {
  member(@log x: number, @log y: number) {
    console.log(`member Parameters: ${x} ${y}`);
  }
}

// 上面示例中，参数装饰器会输出参数的位置序号。注意，后面的参数会先输出。
// 跟其他装饰器不同，参数装饰器主要用于输出信息，没有办法修改类的行为。
const c2 = new C2();
c2.member(5, 5);
// 输出结果:
// member NO.1 Parameter
// member NO.0 Parameter
// member Parameters: 5 5
