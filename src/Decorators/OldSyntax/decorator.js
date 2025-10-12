"use strict";
// 1. experimentalDecorators 编译选项
// $ tsc --target ES5 --experimentalDecorators
// 此外，还有另外一个编译选项--emitDecoratorMetadata，用来产生一些装饰器的元数据，供其他工具或某些模块（比如 reflect-metadata ）使用。
// 这两个编译选项可以在命令行设置，也可以在tsconfig.json文件里面进行设置。
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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
Object.defineProperty(exports, "__esModule", { value: true });
// 下面示例中，使用了装饰器@f，因此类A的构造方法会自动传入 f。
// 类A不需要新建实例，装饰器也会执行。装饰器会在代码加载阶段执行，而不是在运行时执行，而且只会执行一次。
// 由于 TypeScript 存在编译阶段，所以装饰器对类的行为的改变，实际上发生在编译阶段。这意味着，TypeScript 装饰器能在编译阶段运行代码，也就是说，它本质就是编译时执行的函数。
function f(target) {
    console.log('apply decorator');
    return target;
}
let A = (() => {
    let _classDecorators = [f];
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
})(); // 输出：apply decorator
// 上面示例中，使用了装饰器@f，因此类A的构造方法会自动传入 f。
// 类 A 不需要新建实例，装饰器也会执行。装饰器会在代码加载阶段执行，而不是在运行时执行，而且只会执行一次。
// 由于 TypeScript 存在编译阶段，所以装饰器对类的行为的改变，实际上发生在编译阶段。这意味着，TypeScript 装饰器能在编译阶段运行代码，也就是说，它本质就是编译时执行的函数。
// 下面再看一个示例。
// 装饰器 @sealed() 会锁定BugReport这个类，使得它无法新增或删除静态成员和实例成员。
let BugReport = (() => {
    let _classDecorators = [sealed];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BugReport = _classThis = class {
        constructor(t) {
            this.type = 'report';
            this.title = t;
        }
    };
    __setFunctionName(_classThis, "BugReport");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BugReport = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BugReport = _classThis;
})();
function sealed(constructor) {
    console.log(`class ${constructor.name} is sealed`);
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
// 如果除了构造方法，类装饰器还需要其他参数，可以采取“工厂模式”，即把装饰器写在一个函数里面，该函数可以接受其他参数，执行后返回装饰器。但是，这样就需要调用装饰器的时候，先执行一次工厂函数。
// 上面示例中，函数 factory() 的返回值才是装饰器，所以加载装饰器的时候，要先执行一次 @factory('log something')，才能得到装饰器。这样做的好处是，可以加入额外的参数，本例是参数 info。
function factory(info) {
    console.log('received: ', info);
    return function (target) {
        console.log('apply decorator to: ', target);
        return target;
    };
}
let A1 = (() => {
    let _classDecorators = [factory('log something')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var A1 = _classThis = class {
    };
    __setFunctionName(_classThis, "A1");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        A1 = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return A1 = _classThis;
})();
// 总之，@ 后面要么是一个函数名，要么是函数表达式，甚至可以写出下面这样的代码。
// 下面示例中，@后面是一个箭头函数，这也是合法的。
let InlineDecoratorExample = (() => {
    let _classDecorators = [((constructor) => {
            console.log('log something: ', constructor);
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var InlineDecoratorExample = _classThis = class {
    };
    __setFunctionName(_classThis, "InlineDecoratorExample");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InlineDecoratorExample = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InlineDecoratorExample = _classThis;
})();
// 类装饰器可以没有返回值，如果有返回值，就会替代所装饰的类的构造函数。由于 JavaScript 的类等同于构造函数的语法糖，所以装饰器通常返回一个新的类，对原有的类进行修改或扩展。
function decorator(target) {
    return class extends target {
        constructor() {
            super(...arguments);
            this.value = 123;
        }
    };
}
let Foo = (() => {
    let _classDecorators = [decorator];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Foo = _classThis = class {
        constructor() {
            this.value = 456;
        }
    };
    __setFunctionName(_classThis, "Foo");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Foo = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Foo = _classThis;
})();
const foo = new Foo();
console.log('foo.value : ', foo.value); // 123
function decorator1(target) {
    return class extends target {
        constructor() {
            super(...arguments);
            this.value = 123;
        }
    };
}
let Foo1 = (() => {
    let _classDecorators = [decorator1];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Foo1 = _classThis = class {
        constructor() {
            this.value = 456;
        }
    };
    __setFunctionName(_classThis, "Foo1");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Foo1 = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Foo1 = _classThis;
})();
// 方法装饰器一共可以接受三个参数。
// 1. target：（对于类的静态方法）类的构造函数，或者（对于类的实例方法）类的原型。
// 2. propertyKey：所装饰方法的方法名，类型为 string|symbol。
// 3. descriptor：所装饰方法的描述对象。
// 方法装饰器的返回值（如果有的话），就是修改后的该方法的描述对象，可以覆盖原始方法的描述对象。
// 下面是一个示例。
function enumerable(value) {
    return function (target, propertyKey, descriptor) {
        console.log('target === Greeter.prototype : ', target === Greeter.prototype);
        console.log('[method decorator] target:', target, '; propertyKey:', propertyKey, '; descriptor:', descriptor);
        descriptor.enumerable = value;
    };
}
function configurable(value) {
    return function (target, propertyKey, descriptor) {
        console.log('target === Greeter : ', target === Greeter);
        console.log('[static method decorator] target:', target, '; propertyKey:', propertyKey, '; descriptor:', descriptor);
        descriptor.configurable = value;
    };
}
let Greeter = (() => {
    var _a;
    let _staticExtraInitializers = [];
    let _instanceExtraInitializers = [];
    let _static_Hi_decorators;
    let _greet_decorators;
    return _a = class Greeter {
            constructor(message) {
                this.greeting = __runInitializers(this, _instanceExtraInitializers);
                this.greeting = message;
            }
            static Hi() {
                return 'Hi';
            }
            greet() {
                return 'Hello, ' + this.greeting;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _static_Hi_decorators = [configurable(true)];
            _greet_decorators = [enumerable(true)];
            __esDecorate(_a, null, _static_Hi_decorators, { kind: "method", name: "Hi", static: true, private: false, access: { has: obj => "Hi" in obj, get: obj => obj.Hi }, metadata: _metadata }, null, _staticExtraInitializers);
            __esDecorate(_a, null, _greet_decorators, { kind: "method", name: "greet", static: false, private: false, access: { has: obj => "greet" in obj, get: obj => obj.greet }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_a, _staticExtraInitializers);
        })(),
        _a;
})();
// 上面示例中，方法装饰器 @enumerable() 装饰 Greeter 类的 greet() 方法，作用是修改该方法的描述对象的可遍历性属性 enumerable。
// @enumerable(true) 表示将该方法修改成可遍历。
console.log("Reflect.getOwnPropertyDescriptor(Greeter.prototype, 'greet') : ", Reflect.getOwnPropertyDescriptor(Greeter.prototype, 'greet'));
// 下面再看一个例子。
function logger(target, propertyKey, descriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args) {
        console.log('params: ', ...args);
        const result = original.call(this, ...args);
        console.log('result: ', result);
        return result;
    };
}
// 下面示例中，方法装饰器 @logger 用来装饰 add() 方法，它的作用是让该方法输出日志。每当 add() 调用一次，控制台就会打印出参数和运行结果。
let C = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _add_decorators;
    return _a = class C {
            add(x, y) {
                return x + y;
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _add_decorators = [logger];
            __esDecorate(_a, null, _add_decorators, { kind: "method", name: "add", static: false, private: false, access: { has: obj => "add" in obj, get: obj => obj.add }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
// params:  1 2
// result:  3
new C().add(1, 2);
// 属性装饰器函数接受两个参数
// 1. target：（对于实例属性）类的原型对象（prototype），或者（对于静态属性）类的构造函数。
// 2. propertyKey：所装饰属性的属性名，注意类型有可能是字符串，也有可能是 Symbol 值。
// 属性装饰器不需要返回值，如果有的话，也会被忽略。
// 下面是一个示例。
function ValidRange(min, max) {
    return (target, key) => {
        Object.defineProperty(target, key, {
            set: function (v) {
                if (v < min || v > max) {
                    throw new Error(`Not allowed value ${v}`);
                }
            },
        });
    };
}
// 输出 Installing ValidRange on year
let Student = (() => {
    var _a;
    let _year_decorators;
    let _year_initializers = [];
    let _year_extraInitializers = [];
    return _a = class Student {
            constructor() {
                this.year = __runInitializers(this, _year_initializers, void 0);
                __runInitializers(this, _year_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _year_decorators = [ValidRange(1920, 2020)];
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: obj => "year" in obj, get: obj => obj.year, set: (obj, value) => { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
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
function logProperty(target, member) {
    const prop = Object.getOwnPropertyDescriptor(target, member);
    // 输出 Property name undefined
    console.log(`Property ${member}: `, prop);
    console.log('target === PropertyExample.prototype : ', target === PropertyExample.prototype);
}
// 下面示例中，属性装饰器 @logProperty 内部想要获取实例属性 name 的属性描述对象，结果拿到的是 undefined。
// 因为上例的 target 是类的原型对象，不是实例对象，所以拿不到 name 属性，也就是说 target.name 是不存在的，所以拿到的是 undefined。只有通过 this.name 才能拿到 name 属性，但是这时 this 还不存在。
let PropertyExample = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    return _a = class PropertyExample {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, 'Foo');
                __runInitializers(this, _name_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [logProperty];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
// 属性装饰器不仅无法获得实例属性的值，也不能初始化或修改实例属性，而且它的返回值也会被忽略。因此，它的作用很有限。
// 不过，如果属性装饰器设置了当前属性的存取器（ getter / setter ），然后在构造函数里面就可以对实例属性进行读写。
// 下面示例中，属性装饰器@Min通过设置存取器，拿到了实例属性的值
function Min(limit) {
    return function (target, propertyKey) {
        let value;
        const getter = function () {
            return value;
        };
        const setter = function (newVal) {
            if (newVal.length < limit) {
                throw new Error(`Your password should be bigger than ${limit}`);
            }
            else {
                value = newVal;
            }
        };
        Reflect.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
        });
    };
}
let User = (() => {
    var _a;
    let _password_decorators;
    let _password_initializers = [];
    let _password_extraInitializers = [];
    return _a = class User {
            constructor(username, password) {
                this.password = __runInitializers(this, _password_initializers, void 0);
                __runInitializers(this, _password_extraInitializers);
                this.username = username;
                this.password = password;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _password_decorators = [Min(8)];
            __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: obj => "password" in obj, get: obj => obj.password, set: (obj, value) => { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
// 报错 Your password should be bigger than 8
// todo: 实际这块的代码，也没有生效，需要找到原因
// 结论: 只有 compilerOptions 下的 target 设置为 ES5 或是 ES6 的时候，属性装饰器才会生效
const u = new User('Foo', '123456789');
// 存取器装饰器有三个参数。
// target：（ 对于静态属性的存取器 ）类的构造函数，或者（ 对于实例属性的存取器 ）类的原型对象。
// propertyKey：存取器的属性名。
// descriptor：存取器的属性描述对象。
// 存取器装饰器的返回值（如果有的话），会作为该属性新的描述对象。
// 下面是一个示例。
function configurable1(value) {
    return function (target, propertyKey, descriptor) {
        console.log('target === Point.prototype : ', target === Point.prototype);
        descriptor.configurable = value;
    };
}
// 下面示例中，装饰器 @configurable(false) 关闭了所装饰属性（ x 和 y ）的属性描述对象的 configurable 键（ 即关闭了属性的可配置性 ）。
let Point = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _get_x_decorators;
    let _get_y_decorators;
    return _a = class Point {
            constructor(x, y) {
                this._x = __runInitializers(this, _instanceExtraInitializers);
                this._x = x;
                this._y = y;
            }
            get x() {
                return this._x;
            }
            get y() {
                return this._y;
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _get_x_decorators = [configurable1(false)];
            _get_y_decorators = [configurable1(false)];
            __esDecorate(_a, null, _get_x_decorators, { kind: "getter", name: "x", static: false, private: false, access: { has: obj => "x" in obj, get: obj => obj.x }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _get_y_decorators, { kind: "getter", name: "y", static: false, private: false, access: { has: obj => "y" in obj, get: obj => obj.y }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
// 下面的示例是将装饰器用来验证属性值，如果赋值不满足条件就报错。
function validator(target, propertyKey, descriptor) {
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
let C1 = (() => {
    var _a, _C1_foo;
    let _instanceExtraInitializers = [];
    let _set_foo_decorators;
    return _a = class C1 {
            constructor() {
                _C1_foo.set(this, __runInitializers(this, _instanceExtraInitializers));
            }
            set foo(v) {
                __classPrivateFieldSet(this, _C1_foo, v, "f");
            }
            // @validator // TS1207: Decorators cannot be applied to multiple get/set accessors of the same name.
            get foo() {
                return __classPrivateFieldGet(this, _C1_foo, "f");
            }
        },
        _C1_foo = new WeakMap(),
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _set_foo_decorators = [validator];
            __esDecorate(_a, null, _set_foo_decorators, { kind: "setter", name: "foo", static: false, private: false, access: { has: obj => "foo" in obj, set: (obj, value) => { obj.foo = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
// 下面示例中，装饰器用自己定义的存值器，取代了原来的存值器，加入了验证条件。
// Important TypeScript 不允许对同一个属性的存取器（ getter 和 setter ）使用同一个装饰器，也就是说只能装饰两个存取器里面的一个，且必须是排在前面的那一个，否则报错。
const c1 = new C1();
// 参数装饰器接受三个参数。
// target：（ 对于静态方法 ）类的构造函数，或者（ 对于类的实例方法 ）类的原型对象。
// propertyKey：所装饰的方法的名字，类型为 string|symbol。
// parameterIndex：当前参数在方法的参数序列的位置（ 从 0 开始 ）。
// 该装饰器不需要返回值，如果有的话会被忽略。
// 下面是一个示例。
function log(target, propertyKey, parameterIndex) {
    console.log(`${String(propertyKey)} NO.${parameterIndex} Parameter`);
}
class C2 {
    member(x, y) {
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
// 8. 装饰器的执行顺序
// 前面说过，装饰器只会执行一次，就是在代码解析时执行，哪怕根本没有调用类新建实例，也会执行，而且从此就不再执行了。
// 执行装饰器时，按照如下顺序执行。
// 1. 实例相关的装饰器。
// 2. 静态相关的装饰器。
// 3. 构造方法的参数装饰器。
// 4. 类装饰器。
// 请看下面的示例。
function f1(key) {
    return function () {
        console.log('执行：', key);
    };
}
let C3 = (() => {
    let _classDecorators = [f1('类装饰器')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _staticExtraInitializers = [];
    let _instanceExtraInitializers = [];
    let _static_method_decorators;
    let _method_decorators;
    var C3 = _classThis = class {
        static method() { }
        method() { }
        constructor(foo) {
            __runInitializers(this, _instanceExtraInitializers);
        }
    };
    __setFunctionName(_classThis, "C3");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _static_method_decorators = [f1('静态方法')];
        _method_decorators = [f1('实例方法')];
        __esDecorate(_classThis, null, _static_method_decorators, { kind: "method", name: "method", static: true, private: false, access: { has: obj => "method" in obj, get: obj => obj.method }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _method_decorators, { kind: "method", name: "method", static: false, private: false, access: { has: obj => "method" in obj, get: obj => obj.method }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        C3 = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return C3 = _classThis;
})();
// 同一级装饰器的执行顺序，是按照它们的代码顺序。但是，参数装饰器的执行总是早于方法装饰器。
function f2(key) {
    return function () {
        console.log('执行：', key);
    };
}
// 执行结果:
// 执行： 参数1
// 执行： 方法1
// 执行： 属性1
// 执行： 参数2
// 执行： 方法2
// 执行： 属性2
// 下面示例中，实例装饰器的执行顺序，完全是按照代码顺序的。但是，同一个方法的参数装饰器，总是早于该方法的方法装饰器执行。
let C4 = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _m1_decorators;
    let _p1_decorators;
    let _p1_initializers = [];
    let _p1_extraInitializers = [];
    let _m2_decorators;
    let _p2_decorators;
    let _p2_initializers = [];
    let _p2_extraInitializers = [];
    return _a = class C4 {
            m1(foo) { }
            m2(foo) { }
            constructor() {
                this.p1 = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _p1_initializers, void 0));
                this.p2 = (__runInitializers(this, _p1_extraInitializers), __runInitializers(this, _p2_initializers, void 0));
                __runInitializers(this, _p2_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _m1_decorators = [f2('方法1')];
            _p1_decorators = [f2('属性1')];
            _m2_decorators = [f2('方法2')];
            _p2_decorators = [f2('属性2')];
            __esDecorate(_a, null, _m1_decorators, { kind: "method", name: "m1", static: false, private: false, access: { has: obj => "m1" in obj, get: obj => obj.m1 }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _m2_decorators, { kind: "method", name: "m2", static: false, private: false, access: { has: obj => "m2" in obj, get: obj => obj.m2 }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _p1_decorators, { kind: "field", name: "p1", static: false, private: false, access: { has: obj => "p1" in obj, get: obj => obj.p1, set: (obj, value) => { obj.p1 = value; } }, metadata: _metadata }, _p1_initializers, _p1_extraInitializers);
            __esDecorate(null, null, _p2_decorators, { kind: "field", name: "p2", static: false, private: false, access: { has: obj => "p2" in obj, get: obj => obj.p2, set: (obj, value) => { obj.p2 = value; } }, metadata: _metadata }, _p2_initializers, _p2_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
// 如果同一个方法或属性有多个装饰器，那么装饰器将顺序加载、逆序执行。
function f3(key) {
    console.log('加载：', key);
    return function () {
        console.log('执行：', key);
    };
}
// 执行结果:
// 加载： A
// 加载： B
// 加载： C
// 执行： C
// 执行： B
// 执行： A
let C5 = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _m1_decorators;
    return _a = class C5 {
            m1() { }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _m1_decorators = [f3('A'), f3('B'), f3('C')];
            __esDecorate(_a, null, _m1_decorators, { kind: "method", name: "m1", static: false, private: false, access: { has: obj => "m1" in obj, get: obj => obj.m1 }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
// 如果同一个方法有多个参数，那么参数也是顺序加载、逆序执行。
function f4(key) {
    console.log('加载：', key);
    return function () {
        console.log('执行：', key);
    };
}
console.log('--- C6 ---');
class C6 {
    method(a, b, c) { }
}
// 9. 为什么装饰器不能用于函数？
// 总之，由于存在函数提升，使得装饰器不能用于函数。类是不会提升的，所以就没有这方面的问题。
// 另一方面，如果一定要装饰函数，可以采用高阶函数的形式直接执行，没必要写成装饰器。
// function doSomething(name: any) {
//   console.log('Hello, ' + name);
// }
//
// function loggingDecorator(wrapped: Function) {
//   return function () {
//     console.log('Starting');
//     const result = wrapped.apply(this, arguments);
//     console.log('Finished');
//     return result;
//   };
// }
//
// const wrapped = loggingDecorator(doSomething);
// 10. 多个装饰器的合成
// 多个装饰器可以应用于同一个目标对象，可以写在一行。
// @f @g x
// 上面示例中，装饰器@f和@g同时装饰目标对象x。
// 多个装饰器也可以写成多行。
// @f
// @g
// x
// 多个装饰器的效果，类似于函数的合成，按照从里到外的顺序执行。对于上例来说，就是执行f(g(x))。
// 前面也说过，如果f和g是表达式，那么需要先从外到里求值。 ( 装饰器将顺序加载、逆序执行 )
