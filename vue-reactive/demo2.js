// 来自面试之道
function observe(obj) {
  if (!obj || typeof obj !== 'object') return
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function defineReactive(obj, key, val) {
  // 递归子属性
  observe(val)
  let dp = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log('get value')
      // 将 Watcher 添加到订阅
      if (Dep.target) {
        dp.addSub(Dep.target)
      }
      return val
    },
    set: function reactiveSetter(newVal) {
      console.log('change value')
      val = newVal
      // 执行 watcher 的 update 方法
      dp.notify()
    }
  })
}
// test(通过defineProperty实现的数据劫持)
var data = {
  name: 'jln',
  age: {
    xu: 19,
    zhou: 18
  }
}
observe(data)
// let name = data.name // get value
// data.name = 'jyf' // set value
let xuAge = data.age.xu // get value
data.age.xu = '20' // set value

// 订阅发布模式实现依赖收集和派发更新

// 通过 Dep 解耦属性的依赖和更新操作
class Dep {
  constructor() {
    this.subs = []
  }
  // 添加依赖
  addSub(sub) {
    this.subs.push(sub)
  }
  // 更新
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
// 全局属性，通过该属性配置 Watcher
Dep.target = null

class Watcher {
  constructor(obj, key, cb) {
    // 将 Dep.target 指向自己
    // 然后触发属性的 getter 添加监听
    // 最后将 Dep.target 置空
    Dep.target = this
    this.cb = cb
    this.obj = obj
    this.key = key
    this.value = obj[key]
    Dep.target = null
  }
  update() {
    // 获得新值
    this.value = this.obj[this.key]
    // 调用 update 方法更新 Dom
    this.cb(this.value)
  }
}

// test
// 依赖收集是为了将我们需要它在get/set时执行的一些操作收集起来，统一放到dep中储存起来。在get/set触发时派发更新
// 实现方式：Dep定义一个全局变量target，当我们需要向Dep添加依赖时就会给target一个值，通过这个值就会在进入defineReactive函数中get时做判断，然后执行Dep.addSub方法添加依赖
var data = {
  name: 'yck'
}
observe(data)

function update(value) {
  document.querySelector('div').innerText = value
}
// 模拟解析到 `{{name}}` 触发的操作
new Watcher(data, 'name', update)
// update Dom innerText
data.name = 'yyy'