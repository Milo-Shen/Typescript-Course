class Test {
  a = -1;
  app = 4;
  set app(val) {
    console.log('set: ', val);
    this.app = val;
  }
  get app() {
    console.log('get: ', this.app);
    return this.app;
  }
}

const test = new Test();
test.app = 1;
console.log('test.a : ', test.a);
console.log('Reflect.ownKeys(Test.prototype) : ', Reflect.ownKeys(Test.prototype));
console.log('Reflect.ownKeys(test) : ', Reflect.ownKeys(test));
console.log('test.app : ', test.app);
console.log("Reflect.getOwnPropertyDescriptor(test, 'app') : ", Reflect.getOwnPropertyDescriptor(test, 'app'));
