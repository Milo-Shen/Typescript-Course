class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // ownFunc is defined on the instance level
    this.ownFunc = () => {
      console.log('this is instance own function');
    };
  }

  // toString is defined on the prototype
  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

// The constructor of prototype is class itself
console.log(Point.prototype.constructor === Point);

const point = new Point(2, 3);
console.log('point.toString(): ', point.toString()); // (2, 3)
console.log("point.hasOwnProperty('x'): ", point.hasOwnProperty('x')); // true
console.log("point.hasOwnProperty('y'): ", point.hasOwnProperty('y')); // true
console.log("point.hasOwnProperty('toString'): ", point.hasOwnProperty('toString')); // false
console.log("Point.prototype.hasOwnProperty('toString'): ", Point.prototype.hasOwnProperty('toString')); // true
console.log("point.__proto__.hasOwnProperty('toString'): ", point.__proto__.hasOwnProperty('toString')); // true

// getPrototypeOf: get to prototype of the instance
// in this example, the prototype of point is Point
console.log("Object.getPrototypeOf(point).hasOwnProperty('toString'): ", Object.getPrototypeOf(point).hasOwnProperty('toString'));
console.log("Point.prototype.hasOwnProperty('toString'): ", Point.prototype.hasOwnProperty('toString'));

// ownFunc is defined on the instance level
const point1 = new Point(1, 2);
const point2 = new Point(1, 2);
console.log('point1.ownFunc === point2.ownFunc: ', point1.ownFunc === point2.ownFunc);
console.log('point1.toString === point2.toString', point1.toString === point2.toString);

// add printName function to Point's prototype
// Modifying the prototype using an instance's proto property must be done with extreme caution and is not recommended, as it will alter the original definition of the "class" and affect all instances.
point1.__proto__.printName = () => 'Oops';
console.log(point2.printName());

// Instance properties of a class Example
class IncreasingCounter1 {
  constructor() {
    this._count = 0;
  }
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}

class IncreasingCounter2 {
  // the usage of _count here is as same as the _count in IncreasingCounter1
  // Note that the properties defined with the new syntax are properties of the instance object itself, not defined on the prototype of the instance object.
  // The good thing about this new way of writing is that all instance attributes are defined at the top of the class—it looks neat, and you can see right away what attributes the class has.
  _count = 0;
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}

// From the code above, it is immediately obvious that the foo class has two instance attributes—this is very clear at a glance. Additionally, writing it this way is relatively concise.
class foo {
  bar = 'hello';
  baz = 'world';

  constructor() {
    // ...
  }
}

// The setter function and getter function are set on the Descriptor object of the property.
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}
const descriptor = Object.getOwnPropertyDescriptor(CustomHTMLElement.prototype, 'html');
console.log('descriptor', descriptor);
console.log(`'get' in descriptor`, 'get' in descriptor); // true
console.log(`'set' in descriptor`, 'set' in descriptor); // true
console.log("CustomHTMLElement.prototype.hasOwnProperty('html'): ", CustomHTMLElement.prototype.hasOwnProperty('html')); // true

// Property Expression
const methodName = 'getArea';
class Square {
  [methodName]() {
    console.log('Square: ', methodName);
  }
}
new Square()[methodName]();
// methodName function is on the prototype of class Square
Square.prototype[methodName]();

// Class Expression
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
const inst = new MyClass();
console.log('inst.getClassName(): ', inst.getClassName()); // Me
// Me.name; // ReferenceError: Me is not defined

// If "Me" is not used inside the class, it can be omitted, and the code can be written in the following form.
const MyClass_1 = class {
  /* ... */
};
let person = new (class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
})('张三');

person.sayName(); // "张三"

// Static Method
class Foo {
  static classMethod() {
    return 'hello';
  }
}

console.log('Foo.classMethod(): ', Foo.classMethod()); // 'hello'

const foo1 = new Foo();
// foo1.classMethod(); // TypeError: foo1.classMethod is not a function

// Note that if a static method contains the this keyword, this this refers to the class, not the instance.
// In the code above, the static method bar calls this.baz. Here, this refers to the Foo class rather than an instance of Foo, which is equivalent to calling Foo.baz.
// Additionally, it can be seen from this example that a static method can have the same name as a non-static method.
class Foo2 {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello baz');
  }
  baz() {
    console.log('world baz');
  }
  bar() {
    console.log('world bar');
  }
}

Foo2.bar(); // hello baz
new Foo2().bar(); // world ba

// Static methods of a parent class can be inherited by its subclass.
class Foo3 {
  static classMethod() {
    return 'hello';
  }
}
class Bar extends Foo {}
console.log('Bar.classMethod(): ', Bar.classMethod()); // 'hello'

// Static methods can also be called from the super object
class Foo4 {
  static classMethod() {
    return 'hello';
  }
}
class Bar1 extends Foo4 {
  static classMethod() {
    return super.classMethod() + ', too';
  }
}
console.log('Bar1.classMethod(): ', Bar1.classMethod()); // "hello, too"

// Static Property
// Currently, only this syntax is valid. This is because ES6 explicitly specifies that within a Class, there are only static methods and no static properties.
class Foo5 {}
Foo5.prop = 1;
console.log('Foo5.prop: ', Foo5.prop); // 1

// There is now a proposal that introduces static properties for classes; the syntax is to add the static keyword before an instance property.
class MyClass1 {
  static myStaticProp = 42;
  static staticMethod() {
    console.log('MyClass1 staticMethod', this); // this here is: [class MyClass1] { myStaticProp: 42 }
    console.log('MyClass1 staticMethod this instanceof MyClass1: ', this instanceof MyClass1);
    console.log('MyClass1 staticMethod this === MyClass1: ', this === MyClass1);
    console.log('MyClass1 staticMethod called result: ', this.myStaticProp);
  }
  instanceMethod() {
    console.log('MyClass1 instanceMethod', this); // this here is: MyClass1 {}
    console.log('MyClass1 instanceMethod this instanceof MyClass1: ', this instanceof MyClass1);
    console.log('MyClass1 instanceMethod this === MyClass1: ', this === MyClass1);
    console.log('MyClass1 instanceMethod called result: ', this.myStaticProp); // static 成员不可访问
  }
  constructor() {
    console.log(MyClass1.myStaticProp); // 42
  }
}
const myClass1 = new MyClass1();
MyClass1.staticMethod();
myClass1.instanceMethod();
console.log('MyClass1.myStaticProp: ', MyClass1.myStaticProp); // 5
// The static methods and static properties are defined on class definition objects not on it's prototype
console.log("MyClass1.hasOwnProperty('myStaticProp'): ", MyClass1.hasOwnProperty('myStaticProp')); // true
console.log("MyClass1.prototype.hasOwnProperty('myStaticProp'): ", MyClass1.prototype.hasOwnProperty('myStaticProp')); // false
console.log("MyClass1.hasOwnProperty('staticMethod'): ", MyClass1.hasOwnProperty('staticMethod')); // true
console.log("MyClass1.prototype.hasOwnProperty('staticMethod'): ", MyClass1.prototype.hasOwnProperty('staticMethod')); // false

// Private methods and private property
// Method 1: Move the private methods out of the class, because all methods inside the class are visible to the outside.
class Widget {
  foo(params) {
    this.instanceProperty = 5;
    bar.call(this, params);
  }
}
function bar(params) {
  this.snaf = params;
}
const widget = new Widget();
widget.foo('test private method');
console.log('widget.snaf: ', widget.snaf);
console.log("widget.hasOwnProperty('snaf'): ", widget.hasOwnProperty('snaf'));
console.log("widget.hasOwnProperty('instanceProperty'): ", widget.hasOwnProperty('instanceProperty'));

// Make use of the uniqueness of Symbol values to name the private method with a Symbol value.
const privateMethod = Symbol('privateMethod');
const snaf = Symbol('snaf');
class MyClass2 {
  // 公有方法
  foo(params) {
    this[privateMethod](params);
  }

  // 私有方法
  [privateMethod](params) {
    this[snaf] = params;
  }
}
const class2_obj = new MyClass2();
class2_obj.foo('test private method');
console.log('class2_obj[snaf]: ', class2_obj[snaf]);
console.log('Reflect.ownKeys(MyClass2.prototype: ', Reflect.ownKeys(MyClass2.prototype)); // [ 'constructor', 'foo', Symbol(privateMethod) ]
// So, do not export Symbol value, the method will be private method
console.log("class2_obj['Symbol(privateMethod)']: ", class2_obj['Symbol(privateMethod)']);

// ES2022: The Formal Writing of Private Attributes
class IncreasingCounter3 {
  #count = 0;
  // constructor() {
  //   // SyntaxError: Private field '#count' must be declared in an enclosing class
  //   this.#count = 3;
  // }
  constructor() {
    // the priority of instance level method is higher than prototype level method
    this.getCount = () => this.#count + 1;
  }
  get value() {
    console.log('Getting the current value!');
    return this.#count;
  }
  getCount() {
    return this.#count;
  }
  increment() {
    this.#count++;
  }
}

console.log('new IncreasingCounter3().getCount(): ', new IncreasingCounter3().getCount());
// const counter = new IncreasingCounter3();
// counter.#count; // error: SyntaxError: Private field '#count' must be declared in an enclosing class
// counter.#count = 42; // error: SyntaxError: Private field '#count' must be declared in an enclosing class

// Whether inside or outside the class, trying to read a non-existent private attribute will result in an error.
// This behavior is completely different from that of public attributes: if you read a non-existent public attribute, no error will be thrown, and it will only return undefined.
// counter.#myCount; // SyntaxError: Private field '#myCount' must be declared in an enclosing class

// Private Method
class Foo6 {
  #a;
  #b;
  constructor(a, b) {
    this.#a = a;
    this.#b = b;
  }
  #sum() {
    return this.#a + this.#b;
  }
  printSum() {
    console.log(this.#sum());
  }
}
const foo6 = new Foo6(1, 2);
foo6.printSum();

// Private attributes can also have getter and setter methods set up.
class Counter {
  #xValue = 0;
  constructor() {
    console.log(this.#x);
  }
  add() {
    this.#x++;
    console.log(this.#x, this.#xValue);
  }
  get #x() {
    return this.#xValue;
  }
  set #x(value) {
    this.#xValue = value;
  }
}
const counter = new Counter();
counter.add();

// Private attributes are not limited to being referenced via this; as long as it is within the class, instances can also reference private attributes.
class Foo7 {
  #privateValue = 42;
  static getPrivateValue(foo) {
    return foo.#privateValue;
  }
}
console.log('Foo7.getPrivateValue(new Foo7()): ', Foo7.getPrivateValue(new Foo7())); // 42

// Static keywords can also be added before private attributes and private methods to indicate that they are static private attributes or static private methods.
class FakeMath {
  static PI = Math.PI;
  static #totallyRandomNumber = 4;
  static #computeRandomNumber() {
    return FakeMath.#totallyRandomNumber;
  }
  static random() {
    console.log('I heard you like random numbers…');
    return FakeMath.#computeRandomNumber();
  }
}

// In the code above, #totallyRandomNumber is a private attribute, and #computeRandomNumber() is a private method.
// They can only be called inside the FakeMath class; calling them from outside will result in an error.
console.log('FakeMath.PI', FakeMath.PI); // 3.142857142857143
console.log('FakeMath.random(): ', FakeMath.random());
// FakeMath.#totallyRandomNumber; // Error: SyntaxError: Private field '#totallyRandomNumber' must be declared in an enclosing class
// FakeMath.#computeRandomNumber(); // Error: SyntaxError: Private field '#totallyRandomNumber' must be declared in an enclosing class

// The in operator
// As mentioned earlier, directly accessing a non-existent private attribute of a class will result in an error, but accessing a non-existent public attribute will not.
// This feature can be used to determine whether an object is an instance of a class.
class C {
  #brand;
  static isC(obj) {
    try {
      obj.#brand;
      return true;
    } catch {
      return false;
    }
  }
}
const c = new C();
console.log('C.isC(c)', C.isC(c));

// Use in operator to replace try...catch...
class C1 {
  #brand;
  static isC(obj) {
    return #brand in obj;
  }
}
const c1 = new C1();
console.log('C1.isC(c1)', C1.isC(c1));
console.log('C1.isC(c)', C1.isC(c));

class D {
  brand;
  static isD(obj) {
    try {
      obj.brand;
      return true;
    } catch {
      return false;
    }
  }
}
const d = new D();
console.log('D.isD(d)', D.isD(d));

// Use in operator to replace try...catch...
class D1 {
  brand;
  static isD(obj) {
    return 'brand' in obj;
  }
}
const d1 = new D1();
console.log('D1.isD(d1): ', D1.isD(d1));
// The in behavior of private property is different compared with public property
// Private property behavior like Symbol
console.log('D1.isD(d): ', D1.isD(d));

// The in operator used in this way can also be used in conjunction with this.
class A {
  #foo = 0;
  m() {
    console.log(#foo in this); // true
  }
}
new A().m();

// Note that when checking for private attributes, the in operator can only be used inside the class.
// Additionally, the private attribute being checked must be declared first; otherwise, an error will occur.
// In the example above, the private attribute #foo is not declared but is directly used in the check with the in operator, resulting in an error.
// class A1 {
//   m() {
//     console.log(#foo in this); // 报错
//   }
// }

// The static block
// One issue with static properties is that if they have initialization logic, this logic must be written either outside the class or inside the constructor() method.
// class C {
//   static x = 234;
//   static y;
//   static z;
// }
//
// try {
//   const obj = doSomethingWith(C.x);
//   C.y = obj.y
//   C.z = obj.z;
// } catch {
//   C.y = ...;
//   C.z = ...;
// }

// ES2022 The static block
class C2 {
  static x = 1024;
  static y;
  static z;

  // To address this issue, ES2022 introduced static blocks, which allow setting a code block inside the class.
  // This block runs when the class is created and only runs once, with its main role being to initialize static properties.
  // Subsequently, when new instances of the class are created, this block will not run.
  static {
    try {
      const obj = { x: this.x, y: this.x + 1, z: this.x + 2 };
      this.y = obj.y;
      this.z = obj.z;
    } catch {
      this.y = -1;
      this.z = -1;
    }
  }
}
// In the code above, there is a static code block inside the class, which is a static block. Its advantage is that the initialization logic for static properties y and z is written inside the class and only runs once.
// Each class allows multiple static blocks, and each static block can only access static properties declared earlier. Additionally, there cannot be a return statement inside a static block.
console.log('C2.x, C2.y, C2.z: ', C2.x, C2.y, C2.z);

class C3 {
  static x = 1;
  static {
    this.x = 2; // 2
    C3.x = 3; // 3
  }
}
// In the example above, both this.x and C.x can access the static property x.
console.log('C3.x: ', C3.x);

// In addition to the initialization of static properties, the static block has another role: to share private attributes with code outside the class.
let getX;
class C4 {
  #x = '# C4';
  static {
    getX = (obj) => obj.#x;
  }
}
// In the example above, #x is a private attribute of the class.
// If the getX() method outside the class wants to access this attribute, previously it had to be written inside the class's constructor() method.
// In that case, the getX() method would be defined every time a new instance is created.
// Now it can be written inside the static block, so that it is only defined once when the class is created.
console.log('getX(new C4()): ', getX(new C4())); // 1

// Classes do not have variable hoisting, which is completely different from ES5.
// new Foo(); // ReferenceError
// class Foo {}

// The code above will not throw an error, because when Bar inherits from Foo, Foo has already been defined.
// However, if class hoisting existed, the code above would throw an error.
// This is because the class would be hoisted to the top of the code, while the line where Foo is defined would not be hoisted—resulting in Foo being undefined when Bar inherits from it.
{
  let Foo = class {};
  class Bar extends Foo {}
}
