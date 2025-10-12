"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
// 装饰器（Decorator）是一种语法结构，用来在定义时修改类（class）的行为。
// 在语法上，装饰器有如下几个特征。
// （1）第一个字符（或者说前缀）是@，后面是一个表达式。
// （2）@后面的表达式，必须是一个函数（或者执行后可以得到一个函数）。
// （3）这个函数接受所修饰对象的一些相关值作为参数。
// （4）这个函数要么不返回值，要么返回一个新对象取代所修饰的目标对象。
// 举例来说，有一个函数Injectable()当作装饰器使用，那么需要写成@Injectable，然后放在某个类的前面。
function simpleDecorator(value, context) {
    console.log(`hi, this is ${context.kind} ${context.name}`);
    return value;
}
let A = (() => {
    let _classDecorators = [simpleDecorator];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var A = _classThis = class {
    };
    __setFunctionName(_classThis, "A");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        A = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return A = _classThis;
})(); // "hi, this is class A"
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
function decorator(value, context) {
    // ...
}
// 类装饰器一般用来对类进行操作，可以不返回任何值，请看下面的例子。
// 下面示例中，类装饰器 @Greeter 在类 User 的原型对象上，添加了一个 greet() 方法，实例就可以直接使用该方法。
function Greeter(value, context) {
    if (context.kind === 'class') {
        value.prototype.greet = function () {
            console.log('你好');
        };
    }
}
let User = (() => {
    let _classDecorators = [Greeter];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var User = _classThis = class {
    };
    __setFunctionName(_classThis, "User");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
})();
let u = new User();
u.greet(); // "你好"
// 类装饰器可以返回一个函数，替代当前类的构造方法。
function countInstances(value, context) {
    let instanceCount = 0;
    const wrapper = function (...args) {
        instanceCount++;
        const instance = new value(...args);
        instance.count = instanceCount;
        return instance;
    };
    wrapper.prototype = value.prototype; // A
    return wrapper;
}
let MyClass = (() => {
    let _classDecorators = [countInstances];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MyClass = _classThis = class {
    };
    __setFunctionName(_classThis, "MyClass");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MyClass = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MyClass = _classThis;
})();
// 上面示例中，类装饰器 @countInstances 返回一个函数，替换了类 MyClass 的构造方法。新的构造方法实现了实例的计数，每新建一个实例，计数器就会加一，并且对实例添加 count 属性，表示当前实例的编号。
// 注意，上例为了确保新构造方法继承定义在 MyClass 的原型之上的成员，特别加入 A 行，确保两者的原型对象是一致的。否则，新的构造函数 wrapper 的原型对象，与 MyClass 不同，通不过 instanceof 运算符。
const inst1 = new MyClass();
console.log('inst1 instanceof MyClass', inst1 instanceof MyClass); // true
console.log('inst1.count', inst1.count); // 1
// 下面的例子是通过类装饰器，禁止使用 new 命令新建类的实例。
function functionCallable(value, { kind }) {
    if (kind === 'class') {
        return function (...args) {
            if (new.target !== undefined) {
                throw new TypeError('This function can’t be new-invoked');
            }
            return new value(...args);
        };
    }
}
let Person = (() => {
    let _classDecorators = [functionCallable];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Person = _classThis = class {
        constructor(name) {
            this.name = name;
        }
    };
    __setFunctionName(_classThis, "Person");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Person = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Person = _classThis;
})();
// 上面示例中，类装饰器 @functionCallable 返回一个新的构造方法，里面判断 new.target 是否不为空，如果是的，就表示通过 new 命令调用，从而报错。
// @ts-ignore
const robin = Person('Robin');
console.log('robin.name : ', robin.name); // 'Robin'
// 类装饰器的上下文对象 context 的 addInitializer() 方法，用来定义一个类的初始化函数，在类完全定义结束后执行。
// 下面示例中，类 MyComponent 定义完成后，会自动执行类装饰器 @customElement() 给出的初始化函数，该函数会将当前类注册为指定名称（本例为<hello-world>）的自定义 HTML 元素。
function customElement(name) {
    return (value, context) => {
        context.addInitializer(function () {
            customElements.define(name, value);
        });
    };
}
// 根据上面的类型，方法装饰器是一个函数，接受两个参数：value 和 context。
// 参数value是方法本身，参数 context 是上下文对象，有以下属性。
// 1. kind：值固定为字符串 method，表示当前为方法装饰器。
// 2. name：所装饰的方法名，类型为字符串或 Symbol 值。
// 3. static：布尔值，表示是否为静态方法。该属性为只读属性。
// 4. private：布尔值，表示是否为私有方法。该属性为只读属性。
// 5. access：对象，包含了方法的存取器，但是只有 get() 方法用来取值，没有 set() 方法进行赋值。
// 6. addInitializer()：为方法增加初始化函数。
// 方法装饰器会改写类的原始方法，实质等同于下面的操作。
function trace(decoratedMethod) {
    // ...
}
let C = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _toString_decorators;
    return _a = class C {
            toString() {
                return 'C';
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _toString_decorators = [trace];
            __esDecorate(_a, null, _toString_decorators, { kind: "method", name: "toString", static: false, private: false, access: { has: obj => "toString" in obj, get: obj => obj.toString }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
// `@trace` 等同于
// C.prototype.toString = trace(C.prototype.toString);
// 上面示例中，@trace 是方法 toString() 的装饰器，它的效果等同于最后一行对 toString() 的改写。
// 如果方法装饰器返回一个新的函数，就会替代所装饰的原始函数。
// 下面示例中，装饰器 @replaceMethod 返回的函数，就成为了新的 hello() 方法。
function replaceMethod(value, context) {
    return function () {
        return `How are you, ${this.name} ?`;
        // return `How are you, ${context.access.get('name')}?`;
    };
}
let Person1 = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _hello_decorators;
    return _a = class Person1 {
            constructor(name) {
                this.name = __runInitializers(this, _instanceExtraInitializers);
                this.name = name;
            }
            hello() {
                return `Hi ${this.name}!`;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _hello_decorators = [replaceMethod];
            __esDecorate(_a, null, _hello_decorators, { kind: "method", name: "hello", static: false, private: false, access: { has: obj => "hello" in obj, get: obj => obj.hello }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
const robin1 = new Person1('Robin');
console.log('robin1.hello() : ', robin1.hello());
