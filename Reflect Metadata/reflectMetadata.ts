import 'reflect-metadata/lite';

class MyClass {
  private myProperty: string;
  constructor(myProperty: string) {
    this.myProperty = myProperty;
  }

  myMethod() {
    console.log('executing my method');
  }
}
