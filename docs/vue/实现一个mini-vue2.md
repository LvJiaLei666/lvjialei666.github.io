# 实现一个mini-vue2

## 前言

为了更好的理解vue2的实现原理，本文将实现一个mini-vue2，并尽可能的还原vue2的实现原理。

### 1. 核心

vue2的核心是`Object.defineProperty`结合`发布订阅模式`实现的,所以我们先简单了解一下 什么是`Object.defineProperty`和`发布订阅模式`。

#### 1.1 Object.defineProperty

`Object.defineProperty`用来在对象上定义或者修改一个属性值，实现数据劫持，为修改数据后去调用视图更新做准备

```js
  const obj = {}
  let age = 18
  Object.defineProperty(obj, 'age',{
  get() {
      return age
   },
    set(newVal) {
     age = newVal + 1
    },
    enumerable: true
   })
    console.log(obj.age) // 18
    obj.age = 20
    console.log(obj.age) // 21

```

#### 1.2 发布订阅模式

发布订阅模式是一种设计模式，它定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知并自动更新。

```js
class Dep {
  constructor() {
    this.subs = []
  }
  // 添加订阅者
  addSub(sub) {
    this.subs.push(sub)
  }
  // 通知订阅者
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

```

这就是一个简单的发布订阅。但是还缺少一个订阅者，订阅者需要保证每个订阅者都执行 update 方法，所以需要一个 Watcher 类

```js
class Watcher {
  constructor(cb) {
    this.cb = cb
  }
  update() {
    this.cb()
  }
}


// 使用
const dep = new Dep()
const watcher = new Watcher(() => {
  console.log('数据更新了')
})
const watcher2 = new Watcher(() => {
  console.log('数据更新了2')
})
dep.addSub(watcher)
dep.addSub(watcher2)
dep.notify()
// 数据更新了
// 数据更新了2
```

### 2. 具体实现

#### 2.1 初始化

我们先模仿vue，创建一个vue实例，并设置一个data属性

```html
<div id="app">
  <p>{{ message }}</p>
</div>

<script>
  const vm = new Vue({
    data: {
      message: 'Hello, Vue!',
      a:{
          a:"this is a.a"
      },
      b:"this is b"
    }
  })
</script>
```

#### 2.2 数据劫持

Vue2 中数据劫持是通过`Object.defineProperty`来实现的，我们首先需要遍历data中的所有属性，然后对每个属性进行劫持，劫持的目的是为了在属性被修改时，能够通知到视图更新。

```js
// 给对象增加数据劫持
function Observe(data) {
  // 因 defineProperty 每次只能设置单个属性 所以需遍历
  for (let key in data) {
    let val = data[key]
    observe(val)
    Object.defineProperty(data, key, {
      enumerable: true,
      get() {
        return val
      },
      set(newVal) {
        if (newVal === val) return // 新值与旧值相等时 不做处理
        val = newVal // 之所以给 val 赋值 是因为取值时取得val
        observe(newVal) // 当给变量值赋予一个新对象时 依然需要劫持到其属性
      }
    })
  }
}
function observe(data) {
  if (typeof data !== 'object') return
  return new Observe(data)
}
```

#### 2.3 Vue 构造函数

```js
 function Vue(options = {}) {
  //  模仿 Vue 把属性挂载到 $options 且可以通过this._data访问属性
  this.$options = options
  const data = this._data = this.$options.data
  observe(data) // 给 data 增加数据劫持
}
```

上文中我们实现了数据劫持，但是Vue中我们是可以通过this直接访问到data中的数据的，所以需要对Vue进行改造，使得this可以直接访问到data中的数据

#### 2.4 数据代理

想要把属性直接挂在到this上，需要保证直接访问this的属性值是无误的，并且在修改该属性值的时候还能够被劫持到，否则会影响后面的双向绑定，既然data中的数据已经通过observe进行了劫持，那我们在通过this.xxx直接修改属性时候秩序呀哦去修改data对应的属性就可以触发Observe劫持

```js
 function Vue(options = {}) {
  //  模仿 Vue 把属性挂载到 $options
  this.$options = options
  const data = this._data = this.$options.data
  observe(data)
  // 将当前 this 传入方法 将属性挂载到 this 上
  proxyData.call(this, data)
}

// this 代理 this._data
function proxyData(data) {
  const vm = this
  for (let key in data) {
    Object.defineProperty(vm, key, {
      enumerable: true,
      get() {
        return vm._data[key]
      },
      set(newVal) {
        // 直接修改 data 中对应属性 触发 data 中劫持 保持数据统一
        vm._data[key] = newVal 
      }
    })
  }
}

```

#### 2.5 实现compile

先匹配到el中填写的节点，创建一个文档碎片，将节点添加到文档碎片中，然后遍历文档碎片中的节点，如果节点是文本节点，则判断是否是{{}}，如果是则将{{}}中的内容替换为data中的对应属性，如果不是则不做处理

```js
function Compile(el,vm) {
  vm.$el = document.querySelector(el)
  const fragment = document.createDocumentFragment()
  // 将el中的节点添加到fragment中

  while(child = vm.$el.firstChild){
    fragment.appendChild(child)
  }

  // 匹配节点中的 {{}}
  replace(fragment)


  function replace(fragment){
    Array.from(fragment.childNodes).forEach(node => {
        const reg = /\{\{(.*)\}\}/
        const text = node.textContent
        // 判断节点是否为文本节点
        if(node.nodeType === Node.TEXT_NODE && reg.test(text)){
            // 获取{{}}中的完整属性
            const arr = RegExp.$1.split('.')
            // 替换
            const value = vm
            arr.forEach(key => {
                value = value[key]
            })
            node.textContent = text.replace(reg,value)
        }

        // 判断节点是否还有子节点 有则递归
        if(node.childNodes && node.childNodes.length){
            replace(node)
        }
    })
  }

  // 将fragment添加到el中
  vm.$el.appendChild(fragment)
}
```

初始化Vue时候调用 compile

```js
function Vue(options = {}) {
 //  模仿 Vue 把属性挂载到 $options
  this.$options = options
  const data = this._data = this.$options.data
  observe(data)
  // 将当前 this 传入方法 将属性挂载到 this 上
  proxyData.call(this, data) 
  // 调用 compile 方法
  new Compile(options.el,this)
}
```

上面已经实现将 html中的模板（{{}}）替换为data中的属性，但是当data中的属性发生变化时，视图并不会更新，所以需要实现一个watcher，当data中的属性发生变化时，通知视图更新

#### 2.6 组装Watcher与Dep

目前已经实现数据劫持，数据代理，compile，还需要以下工作

1. 需要创建一些订阅者，其update事件就是在接收到更新后的数据值，然后去更新dom，因为要更新dom，所以要在compile中创建。在编译过程中，将每个{{}}中的属性与watcher进行绑定，当属性发生变化时，通知watcher更新，所以，有多少个模板节点，就有多少个watcher

```js

function Compile(el, vm) {
  // 获取挂载元素
  vm.$el = document.querySelector(el)
  // 创建文档碎片，提高性能
  const fragment = document.createDocumentFragment()
  
  // 将el中的所有子节点移入文档碎片
  while (child = vm.$el.firstChild) {
    fragment.appendChild(child)
  }
  
  // 解析文档碎片
  replace(fragment)

  // 解析节点函数
  function replace(fragment) {
    Array.from(fragment.childNodes).forEach(node => {
      const text = node.textContent
      // 匹配{{}}插值表达式
      const reg = /\{\{(.*?)\}\}/g
      
      // 处理文本节点中的插值表达式
      if (node.nodeType === Node.TEXT_NODE && reg.test(text)) {
        const rawText = text
        
        // 替换文本的函数
        function replaceText() {
          let newText = rawText
          let match
          reg.lastIndex = 0
          
          // 替换所有的插值表达式
          while ((match = reg.exec(rawText)) !== null) {
            const exp = match[1].trim()
            const val = getVal(vm, exp)
            newText = newText.replace(match[0], val)
          }
          node.textContent = newText
        }
        
        // 初始化文本
        replaceText()
        
        // 创建watcher进行依赖收集
        const exp = RegExp.$1.trim()
        new Watcher(vm, exp, replaceText)
      }
      // 递归处理子节点
      if (node.childNodes && node.childNodes.length) {
        replace(node)
      }
    })
  }

  // 将处理完的文档碎片放回页面
  vm.$el.appendChild(fragment)
}

```

2. 既然我们的 watcher 新增了参数（vue 实例、节点变量）所以我们需要对 watcher 方法做出更改

```js
class Watcher {
  constructor(vm, exp, fn) {
    // fn 是更新视图的回调函数
    this.fn = fn
    // vm 是 Vue 实例
    this.vm = vm
    // exp 是表达式，如 'a.a' 或 'b'
    this.exp = exp
    
    // 将当前 watcher 实例设置到 Dep.target，用于依赖收集
    // 当访问响应式数据时，会触发 getter，此时就能把 watcher 收集到 dep 中
    Dep.target = this

    // 获取一次值，触发 getter，进行依赖收集
    let val = this.getVal(vm, exp)
    // 依赖收集完成后清空 target
    Dep.target = null
  }

  // 更新方法，由 Dep 通知时调用
  update() {
    // 重新获取最新的值
    let val = this.getVal(this.vm, this.exp)
    // 执行回调函数，更新视图
    this.fn(val)
  }

  // 根据表达式获取值的方法
  getVal(vm, exp) {
    let val = vm
    // 将表达式按照 . 分割，如 'a.a' 会分割成 ['a', 'a']
    const arr = exp.split('.')
    // 逐层获取值，如 vm['a']['a']
    for (let key of arr) {
      val = val[key]
    }
    return val
  }
}
```

3. 订阅者都准备好了，还需要添加订阅者到Dep中并且能在数据变化是通知订阅者更新，这个过程需要在Observe中实现

```js
// 观察者构造函数，用于给对象添加响应式特性
function Observer(data) {
  // 创建依赖收集器实例
  const dep = new Dep()
  
  // 遍历对象的所有属性
  for (let key in data) {
    let val = data[key]
    // 递归观察子属性
    observe(val)
    
    // 使用Object.defineProperty给属性添加getter和setter
    Object.defineProperty(data, key, {
      enumerable: true,
      get() {
        // 如果有正在收集依赖的Watcher，则添加到订阅列表
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set(newVal) {
        // 如果值没有变化，不做处理
        if(newVal === val) return
        console.log('数据变化了')
        // 更新值
        val = newVal
        // 对新值进行观察
        observe(newVal)
        // 通知所有订阅者更新
        dep.notify()
      }
    })
  }
}

// 观察数据的入口函数
function observe(data) {
  // 只对对象类型进行观察
  if(typeof data !== 'object') return
  return new Observer(data)
} 
```

最终我们实现了修改数据后视图会进行更新

#### 2.7 v-model

v-model 是vue中用于双向绑定的指令，它可以将表单元素的值与data中的属性进行绑定，当表单元素的值发生变化时，data中的属性也会发生变化，反之亦然。
在Compile中实现v-model

```js
function Compile(el, vm) {
  // 获取挂载元素
  vm.$el = document.querySelector(el)
  // 创建文档碎片，提高性能
  const fragment = document.createDocumentFragment()
  
  // 将el中的所有子节点移入文档碎片
  while (child = vm.$el.firstChild) {
    fragment.appendChild(child)
  }
  
  // 解析文档碎片
  replace(fragment)

  // 解析节点函数
  function replace(fragment) {
    Array.from(fragment.childNodes).forEach(node => {
      const text = node.textContent
      // 匹配{{}}插值表达式
      const reg = /\{\{(.*?)\}\}/g
      
      // 处理文本节点中的插值表达式
      if (node.nodeType === Node.TEXT_NODE && reg.test(text)) {
        const rawText = text
        
        // 替换文本的函数
        function replaceText() {
          let newText = rawText
          let match
          reg.lastIndex = 0
          
          // 替换所有的插值表达式
          while ((match = reg.exec(rawText)) !== null) {
            const exp = match[1].trim()
            const val = getVal(vm, exp)
            newText = newText.replace(match[0], val)
          }
          node.textContent = newText
        }
        
        // 初始化文本
        replaceText()
        
        // 创建watcher进行依赖收集
        const exp = RegExp.$1.trim()
        new Watcher(vm, exp, replaceText)
      }

      // 处理v-model指令
      if (node.nodeType === 1 && node.hasAttribute('v-model')) {
        const exp = node.getAttribute('v-model')
        // 创建watcher监听数据变化
        new Watcher(vm, exp, (val) => {
          node.value = val
        })
        
        // 监听输入事件实现双向绑定
        node.addEventListener('input', (e) => {
          vm[exp] = e.target.value
        })
      }

      // 递归处理子节点
      if (node.childNodes && node.childNodes.length) {
        replace(node)
      }
    })
  }

  // 将处理完的文档碎片放回页面
  vm.$el.appendChild(fragment)
}

// 获取表达式的值
function getVal(vm, exp) {
  let val = vm
  const arr = exp.split('.')
  for (let key of arr) {
    val = val[key]
  }
  return val || ''
}


```

### 3. 总结

#### 3.1 图解

![mini-vue2](/assets//image/vue2-mini.svg)

通过以上实现，我们实现了一个mini-vue2，虽然还有很多不足，但是已经实现了vue2的核心功能，通过这个实现，我们可以更好的理解vue2的实现原理，为以后的学习打下坚实的基础。
