class Test {
  a = 1;
  b = 2;
  set app(val) {
    console.log('set: ', val);
    return val;
  }
}

const test = new Test();
test.app = 1;
console.log(Object.getOwnPropertyNames(Test.prototype));

class Test2 {}
Reflect.defineProperty(Test2.prototype, 'app', {
  get() {
    return 1;
  },
});
console.log(new Test2().app);
console.log(Object.getOwnPropertyNames(Test2.prototype));
