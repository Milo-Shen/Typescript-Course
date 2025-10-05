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
