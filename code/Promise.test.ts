import MyPromise from './Promise.ts'

// 测试基本功能
console.log('测试1：基本功能 - resolve')
new MyPromise<number>((resolve) => {
  resolve(1)
}).then(value => {
  console.log('值应该为1:', value)
})

// 测试异步功能
console.log('\n测试2：异步功能')
new MyPromise<number>((resolve) => {
  setTimeout(() => {
    resolve(2)
  }, 1000)
}).then(value => {
  console.log('1秒后值应该为2:', value)
})

// 测试链式调用
console.log('\n测试3：链式调用')
new MyPromise<number>((resolve) => {
  resolve(3)
})
  .then(value => value * 2)
  .then(value => {
    console.log('值应该为6:', value)
    return value * 2
  })
  .then(value => {
    console.log('值应该为12:', value)
  })

// 测试错误处理
console.log('\n测试4：错误处理')
new MyPromise<number>((resolve, reject) => {
  reject('出错了')
})
  .then(
    () => console.log('这里不会执行'),
    (error) => {
      console.log('捕获错误:', error)
      return 'recovered'
    }
  )
  .then(value => {
    console.log('恢复后的值:', value)
  })

// 测试 catch
console.log('\n测试5：catch方法')
new MyPromise<number>((resolve, reject) => {
  throw new Error('抛出异常')
})
  .then(() => console.log('这里不会执行'))
  .catch(error => {
    console.log('catch捕获异常:', error.message)
  })

// 测试 finally
console.log('\n测试6：finally方法')
new MyPromise<string>((resolve) => {
  resolve('成功')
})
  .finally(() => {
    console.log('finally被调用')
  })
  .then(value => {
    console.log('finally后的值:', value)
  })

// 测试 resolve 静态方法
console.log('\n测试7：静态resolve方法')
MyPromise.resolve('直接resolve')
  .then(value => {
    console.log('静态resolve的值:', value)
  })

// 测试 resolve promise
console.log('\n测试8：resolve一个promise')
const promise = new MyPromise<number>(resolve => setTimeout(() => resolve(8), 1000))
MyPromise.resolve(promise)
  .then(value => {
    console.log('1秒后值应该为8:', value)
  })

// 测试 reject 静态方法
console.log('\n测试9：静态reject方法')
MyPromise.reject('直接reject')
  .catch(reason => {
    console.log('静态reject的原因:', reason)
  })

// 测试 Promise 嵌套
console.log('\n测试10：Promise嵌套')
new MyPromise<number>(resolve => {
  resolve(10)
})
  .then(value => {
    return new MyPromise<string>(resolve => {
      setTimeout(() => {
        resolve(`内部Promise: ${value}`)
      }, 1000)
    })
  })
  .then(value => {
    console.log('1秒后应该显示"内部Promise: 10":', value)
  }) 