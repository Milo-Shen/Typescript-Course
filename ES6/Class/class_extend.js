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
