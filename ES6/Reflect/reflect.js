// Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API。Reflect对象的设计目的有这样几个。
// （1） 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。
// （2） 修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。

// Old
const target = {};
const property = 'test';
const attributes = {
  value: 'test',
};
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// New
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
console.log('target.test : ', target.test);

// (3） 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
// 老写法
console.log("'assign' in Object : ", 'assign' in Object); // true
// 新写法
console.log("Reflect.has(Object, 'assign') : ", Reflect.has(Object, 'assign')); // true

// （4）Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。
// 下面代码中，Proxy方法拦截target对象的属性赋值行为。它采用Reflect.set方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。
new Proxy(target, {
  set: function (target, name, value, receiver) {
    const success = Reflect.set(target, name, value, receiver);
    if (success) {
      console.log('property ' + name + ' on ' + target + ' set to ' + value);
    }
    return success;
  },
});

// 下面是另一个例子。
const obj = {};
const loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete' + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has' + name);
    return Reflect.has(target, name);
  },
});

// 上面代码中，每一个Proxy对象的拦截操作（get、delete、has），内部都调用对应的Reflect方法，保证原生行为能够正常执行。添加的工作，就是将每一个操作输出一行日志。
// 有了Reflect对象以后，很多操作会更易读。

// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]); // 1
// 新写法
Reflect.apply(Math.floor, undefined, [1.75]); // 1

// 静态方法
// Reflect对象一共有 13 个静态方法。
// - Reflect.apply(target, thisArg, args)
// - Reflect.construct(target, args)
// - Reflect.get(target, name, receiver)
// - Reflect.set(target, name, value, receiver)
// - Reflect.defineProperty(target, name, desc)
// - Reflect.deleteProperty(target, name)
// - Reflect.has(target, name)
// - Reflect.ownKeys(target)
// - Reflect.isExtensible(target)
// - Reflect.preventExtensions(target)
// - Reflect.getOwnPropertyDescriptor(target, name)
// - Reflect.getPrototypeOf(target)
// - Reflect.setPrototypeOf(target, prototype)
// 上面这些方法的作用，大部分与Object对象的同名方法的作用都是相同的，而且它与Proxy对象的方法是一一对应的。下面是对它们的解释。

// Reflect.get(target, name, receiver)
// Reflect.get 方法查找并返回 target 对象的 name 属性，如果没有该属性，则返回 undefined。
const myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

Reflect.get(myObject, 'foo'); // 1
Reflect.get(myObject, 'bar'); // 2
Reflect.get(myObject, 'baz'); // 3

// 如果name属性部署了读取函数（getter），则读取函数的 this 绑定 receiver。
const myObject1 = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

const myReceiverObject1 = {
  foo: 4,
  bar: 4,
};

console.log("Reflect.get(myObject, 'baz') : ", Reflect.get(myObject, 'baz'));
console.log("Reflect.get(myObject, 'foo', myReceiverObject1) : ", Reflect.get(myObject, 'foo', myReceiverObject1)); // 8
console.log("Reflect.get(myObject, 'baz', myReceiverObject1) : ", Reflect.get(myObject, 'baz', myReceiverObject1)); // 8

// 如果第一个参数不是对象，Reflect.get 方法会报错
// Reflect.get(1, 'foo'); // 报错: TypeError: Reflect.get called on non-object
// Reflect.get(false, 'foo'); // 报错: TypeError: Reflect.get called on non-object

// Reflect.set(target, name, value, receiver)
// Reflect.set 方法设置 target 对象的 name 属性等于 value。
const myObject2 = {
  foo: 1,
  set bar(value) {
    return (this.foo = value);
  },
};
console.log(myObject2.foo); // 1
Reflect.set(myObject2, 'foo', 2);
console.log(myObject2.foo); // 2
Reflect.set(myObject2, 'bar', 3);
console.log(myObject2.foo); // 3

// 如果 name 属性设置了赋值函数，则赋值函数的 this 绑定 receiver。
const myObject3 = {
  foo: 4,
  set bar(value) {
    return (this.foo = value);
  },
};
const myReceiverObject3 = {
  foo: 0,
};
Reflect.set(myObject3, 'bar', 1, myReceiverObject3);
console.log('myObject3.foo : ', myObject3.foo); // 4
console.log('myReceiverObject3.foo : ', myReceiverObject3.foo); // 1

// 注意，如果 Proxy 对象和 Reflect 对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了 receiver，那么 Reflect.set 会触发 Proxy.defineProperty 拦截。
const p = {
  a: 'a',
};
// todo: deep learning on receiver
const handler = {
  set(target, key, value, receiver) {
    console.log('set');
    Reflect.set(target, key, value, receiver);
  },
  defineProperty(target, key, attribute) {
    console.log('defineProperty');
    Reflect.defineProperty(target, key, attribute);
  },
};
// 上面代码中，Proxy.set 拦截里面使用了 Reflect.set，而且传入了receiver，导致触发 Proxy.defineProperty 拦截。
// 这是因为 Proxy.set 的 receiver 参数总是指向当前的 Proxy实例（ 即上例的 obj ），而 Reflect.set 一旦传入 receiver，就会将属性赋值到 receiver上面（ 即 obj ），导致触发 defineProperty 拦截。

const obj1 = new Proxy(p, handler);
obj1.a = 'A';
console.log('obj1.a : ', obj1.a);

// 如果 Reflect.set 没有传入 receiver, 那么就不会触发 defineProperty 拦截。
const p1 = {
  a: 'a',
};
// todo: deep learning on receiver
const handler1 = {
  set(target, key, value, receiver) {
    console.log('set');
    Reflect.set(target, key, value, receiver);
  },
  defineProperty(target, key, attribute) {
    console.log('defineProperty');
    Reflect.defineProperty(target, key, attribute);
  },
};
const obj2 = new Proxy(p1, handler1);
obj2.a = 'B';
console.log('obj2.a : ', obj2.a);

// 如果第一个参数不是对象，Reflect.set会报错。
// Reflect.set(1, 'foo', {}); // 报错: TypeError: Reflect.set called on non-object
// Reflect.set(false, 'foo', {}); // 报错: TypeError: Reflect.set called on non-object

// Reflect.has(obj, name)
// Reflect.has 方法对应 name in obj 里面的 in 运算符。
const myObject4 = {
  foo: 1,
};
// 旧写法
console.log('foo' in myObject4); // true
// 新写法
Reflect.has(myObject4, 'foo'); // true

// 如果 Reflect.has() 方法的第一个参数不是对象，会报错。
// Reflect.has(true, 'foo'); // TypeError: Reflect.has called on non-object
