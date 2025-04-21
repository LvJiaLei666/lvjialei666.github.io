const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';


class MyPromise {
  status: string
  value: any
  reason: any

  resolve = (value: any) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
    }
  }

  reject = (reason: any) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
    }
  }

  constructor(executor: (resolve: (value: any) => void, reject: (reason: any) => void) => void) {

    this.status = PENDING


    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }


  }

  then(onFulfilled, onRejected) {
    
  }


}