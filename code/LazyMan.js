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

