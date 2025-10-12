// 装饰器（Decorator）是一种语法结构，用来在定义时修改类（class）的行为。
// 在语法上，装饰器有如下几个特征。
// （1）第一个字符（或者说前缀）是@，后面是一个表达式。
// （2）@后面的表达式，必须是一个函数（或者执行后可以得到一个函数）。
// （3）这个函数接受所修饰对象的一些相关值作为参数。
// （4）这个函数要么不返回值，要么返回一个新对象取代所修饰的目标对象。
// 举例来说，有一个函数Injectable()当作装饰器使用，那么需要写成@Injectable，然后放在某个类的前面。
function simpleDecorator(value: any, context: any) {
  console.log(`hi, this is ${context.kind} ${context.name}`);
  return value;
}

@simpleDecorator
class A {} // "hi, this is class A"

// 3. 装饰器的结构
// 装饰器函数的类型定义如下。
// type Decorator = (
//   value: DecoratedValue,
//   context: {
//     kind: string;
//     name: string | symbol;
//     addInitializer?(initializer: () => void): void;
//     static?: boolean;
//     private?: boolean;
//     access: {
//       get?(): unknown;
//       set?(value: unknown): void;
//     };
//   },
// ) => void | ReplacementValue;

// 上面代码中，Decorator是装饰器的类型定义。它是一个函数，使用时会接收到value和context两个参数。
// 1. value：所装饰的对象。
// 2. context：上下文对象，TypeScript 提供一个原生接口ClassMethodDecoratorContext，描述这个对象。
function decorator(value: any, context: ClassMethodDecoratorContext) {
  // ...
}

// 上面是一个装饰器函数，其中第二个参数 context 的类型就可以写成 ClassMethodDecoratorContext。
// context 对象的属性，根据所装饰对象的不同而不同，其中只有两个属性（ kind 和 name ）是必有的，其他都是可选的。

// （1）kind：字符串，表示所装饰对象的类型，可能取以下的值。
// 'class'
// 'method'
// 'getter'
// 'setter'
// 'field'
// 'accessor'

// 这表示一共有六种类型的装饰器。
// （2）name：字符串或者 Symbol 值，所装饰对象的名字，比如类名、属性名等。
// （3）addInitializer()：函数，用来添加类的初始化逻辑。以前，这些逻辑通常放在构造函数里面，对方法进行初始化，现在改成以函数形式传入 addInitializer() 方法。注意，addInitializer() 没有返回值。
// （4）private：布尔值，表示所装饰的对象是否为类的私有成员。
// （5）static：布尔值，表示所装饰的对象是否为类的静态成员。
// （6）access：一个对象，包含了某个值的 get 和 set 方法。

// 4. 类装饰器
// 类装饰器的类型描述如下。
// 类装饰器接受两个参数：value（当前类本身）和 context（上下文对象）。其中，context 对象的kind属性固定为字符串 class。
type ClassDecorator = (
  value: Function,
  context: {
    kind: 'class';
    name: string | undefined;
    addInitializer(initializer: () => void): void;
  },
) => Function | void;

// 类装饰器一般用来对类进行操作，可以不返回任何值，请看下面的例子。
// 下面示例中，类装饰器 @Greeter 在类 User 的原型对象上，添加了一个 greet() 方法，实例就可以直接使用该方法。
function Greeter(value: any, context: any) {
  if (context.kind === 'class') {
    value.prototype.greet = function () {
      console.log('你好');
    };
  }
}

@Greeter
class User {}

let u = new User();
(u as any).greet(); // "你好"

// 类装饰器可以返回一个函数，替代当前类的构造方法。
function countInstances(value: any, context: any) {
  let instanceCount = 0;

  const wrapper = function (...args: any[]) {
    instanceCount++;
    const instance = new value(...args);
    instance.count = instanceCount;
    return instance;
  } as unknown as typeof MyClass;

  wrapper.prototype = value.prototype; // A
  return wrapper;
}

@countInstances
class MyClass {}

// 上面示例中，类装饰器 @countInstances 返回一个函数，替换了类 MyClass 的构造方法。新的构造方法实现了实例的计数，每新建一个实例，计数器就会加一，并且对实例添加 count 属性，表示当前实例的编号。
// 注意，上例为了确保新构造方法继承定义在 MyClass 的原型之上的成员，特别加入 A 行，确保两者的原型对象是一致的。否则，新的构造函数 wrapper 的原型对象，与 MyClass 不同，通不过 instanceof 运算符。
const inst1 = new MyClass();
console.log('inst1 instanceof MyClass', inst1 instanceof MyClass); // true
console.log('inst1.count', (inst1 as any).count); // 1

// 下面的例子是通过类装饰器，禁止使用 new 命令新建类的实例。
function functionCallable(value: any, { kind }: any): any {
  if (kind === 'class') {
    return function (...args: any) {
      if (new.target !== undefined) {
        throw new TypeError('This function can’t be new-invoked');
      }
      return new value(...args);
    };
  }
}

@functionCallable
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

// 上面示例中，类装饰器 @functionCallable 返回一个新的构造方法，里面判断 new.target 是否不为空，如果是的，就表示通过 new 命令调用，从而报错。
// @ts-ignore
const robin = Person('Robin');
console.log('robin.name : ', robin.name); // 'Robin'

// 类装饰器的上下文对象 context 的 addInitializer() 方法，用来定义一个类的初始化函数，在类完全定义结束后执行。
// 下面示例中，类 MyComponent 定义完成后，会自动执行类装饰器 @customElement() 给出的初始化函数，该函数会将当前类注册为指定名称（本例为<hello-world>）的自定义 HTML 元素。
function customElement(name: string) {
  return <Input extends new (...args: any) => any>(value: Input, context: ClassDecoratorContext) => {
    context.addInitializer(function () {
      customElements.define(name, value);
    });
  };
}

// @customElement('hello-world')
// class MyComponent extends HTMLElement {
//   constructor() {
//     super();
//   }
//   connectedCallback() {
//     this.innerHTML = `<h1>Hello World</h1>`;
//   }
// }

// 5. 方法装饰器
// 方法装饰器用来装饰类的方法（method）。它的类型描述如下。
type ClassMethodDecorator = (
  value: Function,
  context: {
    kind: 'method';
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { get: () => unknown };
    addInitializer(initializer: () => void): void;
  },
) => Function | void;

// 根据上面的类型，方法装饰器是一个函数，接受两个参数：value 和 context。
// 参数value是方法本身，参数 context 是上下文对象，有以下属性。
// 1. kind：值固定为字符串 method，表示当前为方法装饰器。
// 2. name：所装饰的方法名，类型为字符串或 Symbol 值。
// 3. static：布尔值，表示是否为静态方法。该属性为只读属性。
// 4. private：布尔值，表示是否为私有方法。该属性为只读属性。
// 5. access：对象，包含了方法的存取器，但是只有 get() 方法用来取值，没有 set() 方法进行赋值。
// 6. addInitializer()：为方法增加初始化函数。

// 方法装饰器会改写类的原始方法，实质等同于下面的操作。
function trace(decoratedMethod: any) {
  // ...
}

class C {
  @trace
  toString() {
    return 'C';
  }
}

// `@trace` 等同于
// C.prototype.toString = trace(C.prototype.toString);
// 上面示例中，@trace 是方法 toString() 的装饰器，它的效果等同于最后一行对 toString() 的改写。

// 如果方法装饰器返回一个新的函数，就会替代所装饰的原始函数。
// 下面示例中，装饰器 @replaceMethod 返回的函数，就成为了新的 hello() 方法。
function replaceMethod(value: Function, context: ClassMethodDecoratorContext) {
  return function () {
    return `How are you, ${this.name} ?`;
    // return `How are you, ${context.access.get('name')}?`;
  };
}

class Person1 {
  name: string;
  constructor(name: any) {
    this.name = name;
  }

  @replaceMethod
  hello() {
    return `Hi ${this.name}!`;
  }
}

const robin1 = new Person1('Robin');
console.log('robin1.hello() : ', robin1.hello());

// 下面是另一个例子。
// 下面示例中，装饰器 @log 的返回值是一个函数 replacementMethod，替代了原始方法 greet()。在 replacementMethod() 内部，通过执行 originalMethod.call() 完成了对原始方法的调用。
function log(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  function replacementMethod(this: any, ...args: any[]) {
    console.log(`LOG: Entering method '${methodName}'.`);
    const result = originalMethod.call(this, ...args);
    console.log(`LOG: Exiting method '${methodName}'.`);
    return result;
  }

  function _replacementMethod(...args: any[]) {
    console.log(`LOG: Entering method '${methodName}'.`);
    const result = originalMethod.call(this, ...args);
    console.log(`LOG: Exiting method '${methodName}'.`);
    return result;
  }

  return _replacementMethod;
}

class Person2 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  @log
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

// "LOG: Entering method 'greet'."
// "Hello, my name is 张三."
// "LOG: Exiting method 'greet'."
const person2 = new Person2('张三');
person2.greet();

// 利用方法装饰器，可以将类的方法变成延迟执行。
function delay(milliseconds: number = 0) {
  return function (value: any, context: any) {
    if (context.kind === 'method') {
      return function (...args: any[]) {
        setTimeout(() => {
          value.apply(this, args);
        }, milliseconds);
      };
    }
  };
}

class Logger {
  @delay(1)
  log(msg: string) {
    console.log(`${msg}`);
  }
}

// 上面示例中，方法装饰器 @delay(1000) 将方法 log() 的执行推迟了 1 秒（1000毫秒）。这里真正的方法装饰器，是 delay() 执行后返回的函数，delay() 的作用是接收参数，用来设置推迟执行的时间。这种通过高阶函数返回装饰器的做法，称为“工厂模式”，即可以像工厂那样生产出一个模子的装饰器。
const logger = new Logger();
// logger.log('Hello World');

// 方法装饰器的参数 context 对象里面，有一个 addInitializer() 方法。它是一个钩子方法，用来在类的初始化阶段，添加回调函数。这个回调函数就是作为 addInitializer() 的参数传入的，它会在构造方法执行期间执行，早于属性（field）的初始化。
// 下面是 addInitializer() 方法的一个例子。我们知道，类的方法往往需要在构造方法里面，进行 this 的绑定。
class Person3 {
  name: string;
  constructor(name: string) {
    this.name = name;

    // greet() 绑定 this
    this.greet = this.greet.bind(this);
  }

  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const g3 = new Person3('张三').greet;
g3(); // "Hello, my name is 张三."

// 上面例子中，类 Person 的构造方法内部，将 this 与 greet() 方法进行了绑定。如果没有这一行，将 greet() 赋值给变量 g 进行调用，就会报错了。
// this 的绑定必须放在构造方法里面，因为这必须在类的初始化阶段完成。现在，它可以移到方法装饰器的 addInitializer() 里面。
// addInitializer 在每次实例化的时候，都会被调用到
function bound(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = context.name;
  if (context.private) {
    throw new Error(`不能绑定私有方法 ${methodName as string}`);
  }
  // 上面示例中，绑定 this 转移到了 addInitializer() 方法里面。
  context.addInitializer(function (this: any) {
    console.log('this instanceof Person4', this instanceof Person4);
    this[methodName] = this[methodName].bind(this);
  });
}

class Person4 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  @bound
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const g4 = new Person4('李四').greet;
g4(); // "Hello, my name is 李四."

// 下面再看一个例子，通过 addInitializer() 将选定的方法名，放入一个集合。
function collect(value: any, { name, addInitializer }: any) {
  addInitializer(function () {
    if (!this.collectedMethodKeys) {
      this.collectedMethodKeys = new Set();
    }
    this.collectedMethodKeys.add(name);
  });
}

class C2 {
  @collect
  toString() {}

  @collect
  [Symbol.iterator]() {}
}

// 下面示例中，方法装饰器@collect会将所装饰的成员名字，加入一个 Set 集合collectedMethodKeys。
const inst = new C2();
console.log((inst as any).collectedMethodKeys); // new Set(['toString', Symbol.iterator])

// 6. 属性装饰器
// 属性装饰器用来装饰定义在类顶部的属性（field）。它的类型描述如下。
type ClassFieldDecorator = (
  value: undefined,
  context: {
    kind: 'field';
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { get: () => unknown; set: (value: unknown) => void };
    addInitializer(initializer: () => void): void;
  },
) => (initialValue: unknown) => unknown | void;

// 1. 注意，装饰器的第一个参数 value 的类型是 undefined，这意味着这个参数实际上没用的，装饰器不能从 value 获取所装饰属性的值。另外，第二个参数 context 对象的 kind 属性的值为字符串 field，而不是 “property” 或 “attribute” ，这一点是需要注意的。
// 2. 属性装饰器要么不返回值，要么返回一个函数，该函数会自动执行，用来对所装饰属性进行初始化。该函数的参数是所装饰属性的初始值，该函数的返回值是该属性的最终值。
function logged(value: undefined, context: any) {
  const { kind, name } = context;
  if (kind === 'field') {
    return function (initialValue: any) {
      console.log(`initializing ${name} with value ${initialValue}`);
      return initialValue + '--final-value';
    };
  }
}

class Color {
  @logged name = 'green';
}

// "initializing name with value green--final-value"
const color = new Color();
console.log('color.name : ', color.name);
// 上面示例中，属性装饰器 @logged 装饰属性 name。@logged 的返回值是一个函数，该函数用来对属性 name 进行初始化，它的参数 initialValue 就是属性 name 的初始值 green。新建实例对象 color 时，该函数会自动执行。

// 属性装饰器的返回值函数，可以用来更改属性的初始值。
function twice(value: undefined) {
  return (initialValue: any) => initialValue * 2;
}

class C3 {
  @twice
  field = 3;
}

const inst2 = new C3();
console.log('inst2.field : ', inst2.field); // 6

// 7. getter 装饰器，setter 装饰器
// getter 装饰器和 setter 装饰器，是分别针对类的取值器（getter）和存值器（setter）的装饰器。它们的类型描述如下。
type ClassGetterDecorator = (
  value: Function,
  context: {
    kind: 'getter';
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { get: () => unknown };
    addInitializer(initializer: () => void): void;
  },
) => Function | void;

type ClassSetterDecorator = (
  value: Function,
  context: {
    kind: 'setter';
    name: string | symbol;
    static: boolean;
    private: boolean;
    access: { set: (value: unknown) => void };
    addInitializer(initializer: () => void): void;
  },
) => Function | void;
