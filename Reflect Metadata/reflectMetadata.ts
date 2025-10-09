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

// define metadata on instance
const instance = Reflect.construct(MyClass, ['MyClassParam']);
Reflect.defineMetadata('key1', 'value1', instance, 'myProperty');
const hasMetadata = Reflect.hasMetadata('key1', instance, 'myProperty');
console.log('myProperty on instance has Metadata key1: ', hasMetadata);

// get metadata from instance
let metadataValue = Reflect.getMetadata('key1', instance, 'myProperty');
console.log('key1 metadata value on instance: ', metadataValue);
// getMetadata here will return same value as getOwnMetadata
metadataValue = Reflect.getOwnMetadata('key1', instance, 'myProperty');
console.log('key1 metadata value on instance: ', metadataValue);
