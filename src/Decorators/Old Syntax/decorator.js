"use strict";
// 1. experimentalDecorators 编译选项
// $ tsc --target ES5 --experimentalDecorators
// 此外，还有另外一个编译选项--emitDecoratorMetadata，用来产生一些装饰器的元数据，供其他工具或某些模块（比如 reflect-metadata ）使用。
// 这两个编译选项可以在命令行设置，也可以在tsconfig.json文件里面进行设置。
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
// 下面示例中，使用了装饰器@f，因此类A的构造方法会自动传入f。
// 类A不需要新建实例，装饰器也会执行。装饰器会在代码加载阶段执行，而不是在运行时执行，而且只会执行一次。
// 由于 TypeScript 存在编译阶段，所以装饰器对类的行为的改变，实际上发生在编译阶段。这意味着，TypeScript 装饰器能在编译阶段运行代码，也就是说，它本质就是编译时执行的函数。
function f(target) {
    console.log('apply decorator');
    return target;
}
let A = class A {
}; // 输出：apply decorator
A = __decorate([
    f
], A);
