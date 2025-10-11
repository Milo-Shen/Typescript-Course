"use strict";
// 1. experimentalDecorators 编译选项
// $ tsc --target ES5 --experimentalDecorators
// 此外，还有另外一个编译选项--emitDecoratorMetadata，用来产生一些装饰器的元数据，供其他工具或某些模块（比如 reflect-metadata ）使用。
// 这两个编译选项可以在命令行设置，也可以在tsconfig.json文件里面进行设置。
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// 下面示例中，使用了装饰器@f，因此类A的构造方法会自动传入 f。
// 类A不需要新建实例，装饰器也会执行。装饰器会在代码加载阶段执行，而不是在运行时执行，而且只会执行一次。
// 由于 TypeScript 存在编译阶段，所以装饰器对类的行为的改变，实际上发生在编译阶段。这意味着，TypeScript 装饰器能在编译阶段运行代码，也就是说，它本质就是编译时执行的函数。
function f(target) {
    console.log('apply decorator');
    return target;
}
let A = class A {
}; // 输出：apply decorator
A = __decorate([
    f
], A);
// 上面示例中，使用了装饰器@f，因此类A的构造方法会自动传入 f。
// 类 A 不需要新建实例，装饰器也会执行。装饰器会在代码加载阶段执行，而不是在运行时执行，而且只会执行一次。
// 由于 TypeScript 存在编译阶段，所以装饰器对类的行为的改变，实际上发生在编译阶段。这意味着，TypeScript 装饰器能在编译阶段运行代码，也就是说，它本质就是编译时执行的函数。
// 下面再看一个示例。
// 装饰器 @sealed() 会锁定BugReport这个类，使得它无法新增或删除静态成员和实例成员。
let BugReport = class BugReport {
    constructor(t) {
        this.type = 'report';
        this.title = t;
    }
};
BugReport = __decorate([
    sealed
], BugReport);
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
let A1 = class A1 {
};
A1 = __decorate([
    factory('log something')
], A1);
// 总之，@ 后面要么是一个函数名，要么是函数表达式，甚至可以写出下面这样的代码。
// 下面示例中，@后面是一个箭头函数，这也是合法的。
let InlineDecoratorExample = class InlineDecoratorExample {
};
InlineDecoratorExample = __decorate([
    ((constructor) => {
        console.log('log something: ', constructor);
    })
], InlineDecoratorExample);
// 类装饰器可以没有返回值，如果有返回值，就会替代所装饰的类的构造函数。由于 JavaScript 的类等同于构造函数的语法糖，所以装饰器通常返回一个新的类，对原有的类进行修改或扩展。
function decorator(target) {
    return class extends target {
        constructor() {
            super(...arguments);
            this.value = 123;
        }
    };
}
let Foo = class Foo {
    constructor() {
        this.value = 456;
    }
};
Foo = __decorate([
    decorator
], Foo);
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
let Foo1 = class Foo1 {
    constructor() {
        this.value = 456;
    }
};
Foo1 = __decorate([
    decorator1
], Foo1);
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
class Greeter {
    constructor(message) {
        this.greeting = message;
    }
    static Hi() {
        return 'Hi';
    }
    greet() {
        return 'Hello, ' + this.greeting;
    }
}
__decorate([
    enumerable(true)
], Greeter.prototype, "greet", null);
__decorate([
    configurable(true)
], Greeter, "Hi", null);
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
class C {
    add(x, y) {
        return x + y;
    }
}
__decorate([
    logger
], C.prototype, "add", null);
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
class Student {
}
__decorate([
    ValidRange(1920, 2020)
], Student.prototype, "year", void 0);
const stud = new Student();
// todo: 这句话教材上说的不对，需要继续深入研究
stud.year = 2022;
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
class PropertyExample {
    constructor() {
        this.name = 'Foo';
    }
}
__decorate([
    logProperty
], PropertyExample.prototype, "name", void 0);
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
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
__decorate([
    Min(8)
], User.prototype, "password", void 0);
// 报错 Your password should be bigger than 8
// todo: 实际这块的代码，也没有生效，需要找到原因
const u = new User('Foo', 'pass');
// 6. 存取器装饰器
