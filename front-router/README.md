#### 介绍
集成了前端hash路由和history路由的简单实现
最佳实践：移动端footer导航

#### 使用须知
1. controllers中的js文件中需要有每个模块对应的渲染函数render()
2. 该路由模块接收一个对象作为参数。{mode:xxx} 其中xxx：hash || history
3. 该路由实现了发生错误路由时的处理。同其他路由相同，取名为error.js
4. 本路由没有实现路由发生时的导航样式更改，需要在router.js中的controller()函数中自行添加
