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
// 上面示例中，@trace是方法toString()的装饰器，它的效果等同于最后一行对toString()的改写。

// 如果方法装饰器返回一个新的函数，就会替代所装饰的原始函数。
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
