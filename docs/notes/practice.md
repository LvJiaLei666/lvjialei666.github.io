# 练习
> 主要放一些平时碰到的面试题以及解决方案

## lazyMan
> 实现一个LazyMan，可以按照以下方式调用:
```js
LazyMan("Hank");
// 输出:
// Hi! This is Hank!
LazyMan("Hank").sleep(10).eat("dinner");
// 输出
// Hi! This is Hank!
// 等待10秒..
// Wake up after 10
// Eat dinner~
LazyMan("Hank").eat("dinner").eat("supper");
// 输出
// Hi This is Hank!
// Eat dinner~
// Eat supper~
LazyMan("Hank").sleepFirst(5).eat("supper")
//输出
//等待5秒
// Wake up after 5
// Hi This is Hank!
// Eat supper
// 以此类推。

```
> 思路：通过链式调用，每次调用都返回一个新的LazyMan实例，通过队列的方式，将每次调用的方法放入队列中，然后通过next方法，依次执行队列中的方法
> 
> 这里有一个需要注意的点，就是sleepFirst方法，需要将其放在队列的最前面，所以需要使用unshift方法，而不是push方法
> 
> constructor中的setTimeout是为了执行完所有的同步任务后在执行

代码如下：

[//]: # (/code/LazyMan.js)
```js
class LazyManClass {
  constructor(name) {
    this.name = name
    this.taskList = [];

    this.taskList.push(() => {
      console.log(`Hi This is ${this.name}`)
      this.next()
    })

    setTimeout(() => this.next(),0)
  }

  next() {
    if (!this.taskList.length) return

    const item = this.taskList.shift()
    item()
  }

  eat(foot) {
    this.taskList.push(() => {
      console.log(`Eat ${foot}`)
      this.next()
    })
    return this
  }

  sleep(delay) {
    this.taskList.push(
      () => {
        setTimeout(() => {
          console.log(`Wake up after ${delay}`)
          this.next()
        }, 1000 * delay)

      })
    return this
  }

  sleepFirst(delay) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${delay}`)
        this.next()
      }, delay * 1000)
    }
    this.taskList.unshift(task)
    return this
  }


}

function LazyMan(name) {
  return new LazyManClass(name)
}


```


