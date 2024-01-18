class TaskScheduler {
  constructor() {
    this.tasks = {};
    this.timers = {};
    this.isStarted = false;
  }

  schedule(taskName, delay, callback) {
    if (!taskName || !delay || !callback) {
      throw new Error('Invalid arguments');
    }
    // 存储回调函数及其延迟。
    this.tasks[taskName] = { delay, callback, scheduled: false };

    // 如果调度程序已启动，请立即调度任务。
    if (this.isStarted) {
      this.scheduleTask(taskName);
    }
  }

  scheduleTask(taskName) {
    const task = this.tasks[taskName];
    if (task && !task.scheduled) {
      task.scheduled = true;
      // 调度任务并存储计时器ID。
      this.timers[taskName] = setTimeout(() => {
        task.callback();
        // 任务执行完成后，重置任务状态。
        task.scheduled = false;
        this.timers[taskName] = null;
      }, task.delay);
    }
  }

  start() {
    this.isStarted = true;
    // 调度所有尚未调度的任务。
    for (let taskName in this.tasks) {
      this.scheduleTask(taskName);
    }
  }

  cancel(taskName) {
    if (this.timers[taskName]) {
      clearTimeout(this.timers[taskName]);
      // 如果您希望能够重新安排任务，也可以选择将任务留在列表中。
      // this.tasks[taskName].scheduled = false;
      this.timers[taskName] = null;
    }
  }
}

const scheduler = new TaskScheduler();

scheduler.schedule('hello', 2000, () => {
  console.log('Hello, World!');
});

scheduler.schedule('goodbye', 4000, () => {
  console.log('Goodbye, World!');
});

scheduler.start();

// 在某些条件下取消任务
scheduler.cancel('goodbye');