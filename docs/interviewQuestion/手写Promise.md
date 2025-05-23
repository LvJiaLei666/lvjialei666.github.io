# 手写Promise

## PromiseA+规范

想要手写一个 Promise，就要遵循 [Promise/A+](https://promisesaplus.com/) 规范，业界所有 Promise 的类库都遵循这个规范。
其实 Promise/A+ 规范对如何实现一个符合标准的 Promise 类库已经阐述的很详细了。每一行代码在 Promise/A+ 规范中都有迹可循


Promise/A+ 有一下几个特点
>  
> - promise 有三个状态：pending，fulfilled，or rejected；「规范 Promise/A+ 2.1」
> - 当new promise时， 需要传递一个executor()执行器，执行器立即执行；
> - executor接受两个参数，分别是resolve和reject；
> - promise  的默认状态是 pending；
> - promise 有一个value保存成功状态的值，可以是undefined/thenable/promise；「规范 Promise/A+ 1.3」
> - promise 有一个reason保存失败状态的值；「规范 Promise/A+ 1.5」
> - promise 只能从pending到rejected, 或者从pending到fulfilled，状态一旦确认，就不会再改变；
> - promise 必须有一个then方法，then 接收两个参数，分别是 promise 成功的回调 onFulfilled, 和 promise 失败的回调 onRejected；「规范 Promise/A+ 2.2」
> - 如果调用 then 时，promise 已经成功，则执行onFulfilled，参数是promise的value；
> - 如果调用 then 时，promise 已经失败，那么执行onRejected, 参数是promise的reason；
> - 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调onRejected；


```js
class {
}
```

