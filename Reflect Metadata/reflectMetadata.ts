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

const instance = Reflect.construct(MyClass, ['MyClassParam']);
Reflect.defineMetadata('key1', 'value1', instance, 'myProperty');
console.log('myProperty on instance has Metadata key1: ', Reflect.hasMetadata('key1', instance, 'myProperty'));
