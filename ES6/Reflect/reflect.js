// The Reflect object, like the Proxy object, is also a new API provided by ES6 for manipulating objects. The Reflect object has several design purposes.

// Old
const target = {};
const property = 'test';
const attributes = {
  value: 'test',
};
try {
  Object.defineProperty(target, property, attributes);
  // success
} catch (e) {
  // failure
}

// New
if (Reflect.defineProperty(target, property, attributes)) {
  // success
} else {
  // failure
}
console.log('target.test : ', target.test);
