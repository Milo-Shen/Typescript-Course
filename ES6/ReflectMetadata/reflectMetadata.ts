import 'reflect-metadata/lite';

class MyClass {
  private myProperty: string;
  constructor(myProperty: string) {
    this.myProperty = myProperty;
  }

  @Reflect.metadata('customKey', 'customValue')
  myMethod() {
    console.log('executing my method');
  }
}

// define metadata on instance
const instance = Reflect.construct(MyClass, ['MyClassParam']);
Reflect.defineMetadata('key1', 'value1', instance, 'myProperty');
let hasMetadata = Reflect.hasMetadata('key1', instance, 'myProperty');
console.log('myProperty on instance has Metadata key1: ', hasMetadata);

// get metadata from instance
let metadataValue = Reflect.getMetadata('key1', instance, 'myProperty');
console.log('key1 metadata value on instance: ', metadataValue);
// getMetadata here will return same value as getOwnMetadata
metadataValue = Reflect.getOwnMetadata('key1', instance, 'myProperty');
console.log('key1 metadata value on instance: ', metadataValue);

// metadata can be added to a non-existent property
Reflect.defineMetadata('key1', 'value1', instance, 'non-existent-property');
hasMetadata = Reflect.hasMetadata('key1', instance, 'non-existent-property');
console.log('non-existent-property on instance has Metadata key1: ', hasMetadata);

// get own metadata: Reflect.getOwnMetadata
const metadataValue1 = Reflect.getOwnMetadata('customKey', instance, 'myMethod');
console.log('[Reflect.getOwnMetadata] metadataValue1: ', metadataValue1);
const metadataValue2 = Reflect.getMetadata('customKey', instance, 'myMethod');
console.log('[Reflect.getMetadata] metadataValue2: ', metadataValue2);
const metadataValue3 = Reflect.getMetadata('customKey', Reflect.getPrototypeOf(instance)!, 'myMethod');
console.log('[Reflect.getMetadata] metadataValue3: ', metadataValue3);
const metadataValue4 = Reflect.getMetadata('customKey', MyClass.prototype, 'myMethod');
console.log('[Reflect.getMetadata] metadataValue4: ', metadataValue4);

// delete metadata
Reflect.deleteMetadata('key1', instance, 'myProperty');
hasMetadata = Reflect.hasMetadata('key1', instance, 'myProperty');
metadataValue = Reflect.getMetadata('key1', instance, 'myProperty');
console.log('[Reflect.hasMetadata] after delete: ', hasMetadata);
console.log('[Reflect.getMetadata] after delete: ', metadataValue);
