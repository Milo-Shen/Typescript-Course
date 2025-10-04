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
  static staticMethod() {}
  constructor() {
    console.log(MyClass1.myStaticProp); // 42
  }
}
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
