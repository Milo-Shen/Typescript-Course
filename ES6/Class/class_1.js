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
console.log(point.toString()); // (2, 3)
console.log(point.hasOwnProperty('x')); // true
console.log(point.hasOwnProperty('y')); // true
console.log(point.hasOwnProperty('toString')); // false
console.log(point.__proto__.hasOwnProperty('toString')); // true

// getPrototypeOf: get to prototype of the instance
// in this example, the prototype of point is Point
console.log(Object.getPrototypeOf(point).hasOwnProperty('toString'));
console.log(Point.prototype.hasOwnProperty('toString'));

// ownFunc is defined on the instance level
const point1 = new Point(1, 2);
const point2 = new Point(1, 2);
console.log(point1.ownFunc === point2.ownFunc);
console.log(point2.toString === point2.toString);