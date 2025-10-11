class Test {
  a = 1;
  b = 2;
  app = 4;
  set app(val) {
    console.log('set: ', val);
    return val;
  }
}

const test = new Test();
test.app = 1;
console.log(Object.getOwnPropertyNames(Test.prototype));
