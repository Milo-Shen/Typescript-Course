// ES6 specifies that a subclass must call super() in its constructor() method; otherwise, an error will be thrown.
// This means that when a subclass instance is created, the constructor of the parent class will definitely run first.
class Foo {
  constructor() {
    console.log('Parent Constructor be called');
  }
}

class Bar extends Foo {
  constructor() {
    super();
    console.log('Child Constructor be called');
  }
}

new Bar();

// In the subclass's constructor() method, the this keyword can only be used after calling super();
// otherwise, an error will be thrown.
// This is because the construction of a subclass instance must first complete the inheritance from the parent class, and only the super() method enables the subclass instance to inherit from the parent class.
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
    // this.color = color;
    super(x, y);
    this.color = color; // 正确
  }
}

// If a subclass does not define a constructor() method, this method will be added by default, and it will call super() internally.
// In other words, regardless of whether it is explicitly defined or not, every subclass has a constructor() method.
// class ColorPoint extends Point {}
//
// // Equals to
// class ColorPoint extends Point {
//   constructor(...args) {
//     super(...args);
//   }
// }
const cp = new ColorPoint(25, 8, 'green');
// In the example above, the instance object cp is an instance of both the ColorPoint and Point classes at the same time.
// This behavior is exactly consistent with that of ES5.
console.log('cp instanceof ColorPoint: ', cp instanceof ColorPoint);
console.log('cp instanceof Point: ', cp instanceof Point);

// Inheritance of private properties and private methods
// All properties and methods of a parent class will be inherited by its subclasses, except for private properties and methods.
// A subclass cannot inherit the private properties and methods of its parent class;
// in other words, private properties can only be used within the class where they are defined.
class Foo1 {
  #p = 1;
  #m() {
    console.log('hello');
  }
}

class Bar1 extends Foo1 {
  constructor() {
    super();
    // console.log(this.#p); // Error: SyntaxError: Private field '#p' must be declared in an enclosing class
    // this.#m(); // Error: SyntaxError: Private field '#m' must be declared in an enclosing class
  }
}

// If the parent class defines read and write methods for private properties, subclasses can read and write those private properties through these methods.
class Foo2 {
  #p = 1;
  getP() {
    return this.#p;
  }
}

class Bar2 extends Foo2 {
  constructor() {
    super();
    console.log('this.getP(): ', this.getP());
  }
}
new Bar2();

// Inheritance of static properties and static methods
class A {
  static hello() {
    console.log('hello world');
  }
}
class B extends A {}
// The static properties and static methods of a parent class are also inherited by its subclasses.
B.hello(); // hello world

// Note that static properties are inherited through shallow copying.
class A1 {
  static foo = 100;
}
class B1 extends A1 {
  constructor() {
    super();
    B1.foo--;
  }
}

new B1();
console.log('B1.foo: ', B1.foo);
console.log('A1.foo: ', A1.foo);

// However, because this copying is a shallow copy, if the value of a parent class's static property is an object, the subclass's static property will also point to this object.
// This is because a shallow copy only copies the memory address of the object.
class A2 {
  static foo = { n: 100 };
}
class B2 extends A2 {
  constructor() {
    super();
    B2.foo.n--;
  }
}

// In the example above, the value of A.foo is an object.
// Due to shallow copying, B.foo and A.foo point to the same object.
// Therefore, when the subclass B modifies the property values of this object, it will affect the parent class A.
new B2();
console.log('B2.foo.n: ', B2.foo.n); // 99
console.log('A2.foo.n: ', A2.foo.n); // 99

// Object.getPrototypeOf()
class Point1 {}
class ColorPoint1 extends Point1 {}
// The Object.getPrototypeOf() method can be used to retrieve the parent class from a subclass.
// todo: need deep understanding of Object.getPrototypeOf
console.log(Object.getPrototypeOf(ColorPoint1) === Point1); // true
console.log(ColorPoint1.__proto__ === Point1); // true
console.log(Object.getPrototypeOf(new Point1()) === Point1.prototype); // true

// Super Keyword
// The keyword "super" can be used both as a function and as an object. Its usage is completely different in these two cases.
// Case 1: When super is called as a function
class A3 {
  constructor() {
    console.log(new.target.name);
  }
}
class B3 extends A3 {
  constructor() {
    super();
  }
}
new A3(); // A3
new B3(); // B3

// However, when super() is executed in the subclass constructor, the subclass's properties and methods have not yet been bound to this.
// Therefore, if there are properties with the same name, the property obtained at this point is the one from the parent class.
class A4 {
  name = 'A4';
  constructor() {
    console.log('My name is ' + this.name);
  }
}
class B4 extends A4 {
  name = 'B4';
}
// In the example above, the last line outputs "A" instead of "B".
// The reason is that when super() is executed, the name property of class B has not yet been bound to this—therefore, this.name retrieves the name property of class A.
new B4(); // My name is A4

// When used as a function, super() can only be employed within the constructor of a subclass;
// using it elsewhere will result in an error.
// class A5 {}
// class B5 extends A5 {
//   m() {
//     // SyntaxError: 'super' keyword unexpected here
//     super();
//   }
// }

// case 2:
// When super is used as an object:
//   1. In an instance method, it refers to the parent class's prototype object.
//   2. In a static method, it refers to the parent class itself.
class A6 {
  p() {
    return 'A6';
  }
}
class B6 extends A6 {
  constructor() {
    super();
    console.log(super.p()); // 'A6'
    console.log(super.p === A6.prototype.p);
  }
}
// In the code above, super.p() in subclass B uses super as an object.
// At this point, since super is in an instance method, it refers to A.prototype—so super.p() is equivalent to A.prototype.p().
new B6();

// It should be noted here that since super refers to the parent class's prototype object,
// methods or properties defined on the parent class instance cannot be called via super.
class A7 {
  constructor() {
    this.p = 2;
  }
}
class B7 extends A7 {
  get m() {
    return super.p;
  }
}
let b7 = new B7();
// In the code above, p is a property of the instance of parent class A, so super.p cannot reference it.
console.log('b7.m: ', b7.m);

// If a property is defined on the prototype object of the parent class, super can access it.
class A8 {}
A8.prototype.x = 'A8';
class B8 extends A8 {
  constructor() {
    super();
    console.log(super.x); // A8
  }
}
new B8();

// ES6 specifies that when a parent class's method is called via super in an instance method of a subclass,
// the this inside the method refers to the current instance of the subclass.
class A9 {
  constructor() {
    this.x = 'A9';
  }
  print() {
    console.log(this.x);
  }
}
class B9 extends A9 {
  constructor() {
    super();
    this.x = 'B9';
  }
  m() {
    super.print();
  }
}
// In the code above, although super.print() calls A.prototype.print(), the this inside A.prototype.print() refers to an instance of subclass B, resulting in an output of 2 instead of 1.
// In other words, what is actually executed is super.print.call(this).
let b9 = new B9();
b9.m(); // B9

// Important !:  Since this refers to the subclass instance, if a property is assigned a value via super, then super acts as this at this point, and the property being assigned will become a property of the subclass instance.
class A10 {
  constructor() {
    this.x = 1;
  }
}
class B10 extends A10 {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log('super.x : ', super.x); // undefined
    console.log('this.x : ', this.x); // 3
  }
}
new B10();

// If super is used as an object in a static method, then super refers to the parent class itself at this point, rather than the parent class's prototype object.
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }
  myMethod(msg) {
    console.log('instance', msg);
  }
}
class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }
  myMethod(msg) {
    super.myMethod(msg);
  }
}
// In the code above, when super is used in a static method, it refers to the parent class;
// when used in an instance method, it refers to the parent class's prototype object.
Child.myMethod(1); // static 1
const child = new Child();
child.myMethod(2); // instance 2
