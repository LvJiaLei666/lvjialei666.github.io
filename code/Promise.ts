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