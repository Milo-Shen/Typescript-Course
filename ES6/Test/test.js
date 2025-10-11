class Test {
  a = -1;
  app = 4;
  set app(val) {
    console.log('set: ', val);
    this.a = val + 500;
  }
  get app() {
    return -100;
  }
}

const test = new Test();
test.app = 1;
console.log('test.a : ', test.a);
console.log('Reflect.ownKeys(Test.prototype) : ', Reflect.ownKeys(Test.prototype));
console.log('Reflect.ownKeys(test) : ', Reflect.ownKeys(test));
console.log('test.app : ', test.app);
console.log("Reflect.getOwnPropertyDescriptor(test, 'app') : ", Reflect.getOwnPropertyDescriptor(test, 'app'));
