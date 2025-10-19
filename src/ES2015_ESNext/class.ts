class Test {
  app: string;

  constructor(app: string) {
    this.app = app;
  }
}

const test = new Test('app');
console.log('1: ', Reflect.getOwnPropertyDescriptor(test, 'app'));
console.log('2: ', Reflect.getOwnPropertyDescriptor(Test.prototype, 'app'));
console.log('3: ', test.app);
