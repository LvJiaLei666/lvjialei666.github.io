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

## 完整实现

```typescript
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise<T> {
  status: string
  value: T | undefined
  reason: any
  onFulfilledCallbacks: Array<(value: T) => void>
  onRejectedCallbacks: Array<(reason: any) => void>

  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  resolve = (value: T) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn(value))
    }
  }

  reject = (reason: any) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => fn(reason))
    }
  }

  then(onFulfilled?: ((value: T) => any) | null, onRejected?: ((reason: any) => any) | null): MyPromise<any> {
    // 处理参数可选的情况
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        try {
          const x = onFulfilled!(this.value!)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }

      const rejectedMicrotask = () => {
        try {
          const x = onRejected!(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }

      if (this.status === FULFILLED) {
        queueMicrotask(fulfilledMicrotask)
      }

      if (this.status === REJECTED) {
        queueMicrotask(rejectedMicrotask)
      }

      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(fulfilledMicrotask)
        })
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(rejectedMicrotask)
        })
      }
    })

    return promise2
  }

  catch(onRejected?: (reason: any) => any) {
    return this.then(null, onRejected)
  }

  finally(callback: () => void): MyPromise<T> {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason })
    )
  }

  static resolve<T>(value?: T): MyPromise<T> {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise(resolve => resolve(value as T))
  }

  static reject(reason?: any): MyPromise<never> {
    return new MyPromise((_, reject) => reject(reason))
  }
}

function resolvePromise<T>(
  promise2: MyPromise<T>,
  x: any,
  resolve: (value: T) => void,
  reject: (reason: any) => void
): void {
  if (promise2 === x) {
    reject(new TypeError('Chaining cycle detected for promise'))
    return
  }

  if (x instanceof MyPromise) {
    x.then(resolve, reject)
    return
  }

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let called = false
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          (y: any) => {
            if (called) return
            called = true
            resolvePromise(promise2, y, resolve, reject)
          },
          (r: any) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

export default MyPromise;
```

## 代码说明

这个 Promise 实现完全符合 Promise/A+ 规范，包含以下主要特性：

1. **三种状态**：
   - PENDING（进行中）
   - FULFILLED（已成功）
   - REJECTED（已失败）

2. **状态转换**：
   - 只能从 PENDING 转换到 FULFILLED
   - 只能从 PENDING 转换到 REJECTED
   - 状态一旦改变，就不能再变

3. **then 方法**：
   - 支持链式调用
   - 可以处理同步和异步操作
   - 实现了值的传递和错误处理
   - 使用 `queueMicrotask` 确保异步执行顺序

4. **错误处理**：
   - 支持 `catch` 方法
   - 支持 `finally` 方法
   - 完整的错误传递机制

5. **静态方法**：
   - `Promise.resolve`
   - `Promise.reject`

6. **完整的类型支持**：
   - 使用 TypeScript 实现
   - 泛型支持
   - 完整的类型检查

这个实现不仅完全符合规范，还添加了现代 Promise 所具有的其他实用方法，如 `catch` 和 `finally`。同时，通过 TypeScript 的类型系统，提供了更好的类型安全性和开发体验。
