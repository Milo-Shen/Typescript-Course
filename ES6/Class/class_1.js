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
