// 引入controllers中的js
// 这些js导出模块需要有一个render()方法，用于渲染html模板
import index from '../controllers/index'
import home from '../controllers/home'
import category from '../controllers/category'
import cart from '../controllers/cart'
import user from '../controllers/user'
import error from '../controllers/error'

export default class Router {
    constructor(obj) {
        // 参数obj为路由选项 obj.mode = hash||history
        this.mode = obj.mode
        this.routes = {
            '/index': index,
            '/index/home': home,
            '/index/category': category,
            '/index/cart': cart,
            '/index/user': user,
            '/error': error
        }
        this.init()
    }
    init() {
        // 首次加载
        index.render()
        if (this.mode === 'hash') {
            window.addEventListener('load', this.hashRefresh.bind(this), false)
            window.addEventListener('hashchange', this.hashRefresh.bind(this), false);
        } else {
            // 添加history路由，这里绑定给了'.nav-router-a'的a标签
            $('#app').on('click', '.nav-router-a', this.handleLink.bind(this))
            window.addEventListener('load', this.loadView.bind(this, location.pathname));
            // 给浏览器的前进后退按钮添加路由
            window.addEventListener('popstate', this.historyRefresh.bind(this))
        }
    }
    /**
     * history路由
     * 拦截a标签点击事件
     *
     * @param {*} e
     * @memberof Router
     */
    handleLink(e) {
        e.preventDefault()
        let href = $(e.currentTarget).attr('href')
        if (href.slice(0, 1) !== '#') {
            // 非路由 直接跳转
            window.location.href = href
        } else {
            let path = href.slice(1)
            // pushState添加历史记录。state为 { path:xxx }
            history.pushState({
                path: path
            }, null, path)
            this.loadView(path.split('?')[0])
        }
    }

    /**
     * history路由
     * popstate事件回调函数
     *
     * @param {*} e
     * @memberof Router
     */
    historyRefresh(e) {
        const state = e.state || {}
        const path = state.path.split('?')[0] || null
        if (path) {
            this.loadView(path)
        }
    }
    /**
     * hash路由
     *
     * @memberof Router
     */
    hashRefresh() {
        var currentURL = location.hash.slice(1).split('?')[0] || '/index/position'
        this.loadView(currentURL)
    }
    /**
     * 加载页面
     *
     * @param {string} currentURL
     * @memberof Router
     */
    loadView(currentURL) {
        if (this.mode === 'history' && currentURL === '/') {
            history.replaceState({
                path: '/'
            }, null, '/')
            currentURL = '/index/home'
        }
        this.currentURLlist = currentURL.slice(1).split('/')
        this.url = ""
        this.currentURLlist.forEach((item, index) => {
            this.url += "/" + item
            this.controllerName = this.routes[this.url]
            // 404页面处理
            if (!this.controllerName) {
                this.errorPage()
                return false
            }
            // 路由处理
            if (this.oldURL && this.oldURL[index] == this.currentURLlist[index]) {
                this.handleSubRouter(item, index)
            } else {
                this.controller(this.controllerName, this.url)
            }
        });
        // 记录链接数组,后续用于与新路由做比较，按需加载html模板
        this.oldURL = JSON.parse(JSON.stringify(this.currentURLlist))
    }

    /**
     * 多级路由处理函数
     *
     * @param {*} item
     * @param {*} index
     * @memberof Router
     */
    handleSubRouter(item, index) {
        // 新路由是旧路由的子级
        if (this.oldURL.length < this.currentURLlist.length) {
            // 相同路由部分不重新加载
            if (item !== this.oldURL[index]) {
                this.controller(this.name)
            }
        }
        // 新路由是旧路由的父级
        if (this.oldURL.length > this.currentURLlist.length) {
            var len = Math.min(this.oldURL.length, this.currentURLlist.length)
            // 只重新加载最后一个路由
            if (index == len - 1) {
                this.controller(this.name)
            }
        }
    }
    errorPage() {
        if (this.mode === 'hash') {
            location.href = '#/error'
        } else {
            history.replaceState({
                path: '/error'
            }, null, '/error')
            this.loadView('/error')
        }
    }
    /**
     * 功能函数：1.渲染页面   2.导航激活样式（此处注释掉了）
     *
     * @param {*} name name 是当前路由匹配的那个 controller
     * @param {*} item item 导航添加样式所需的辨认参数
     *          为什么写在这里？为了history路由不论任何方式发生路由跳转（包括浏览器前进后退）都能成功添加样式，因此将其写在路由发生时必然会调用的loadView函数内。
     * @memberof Router
     */
    controller(name, item) {
        name.render()
        // this.navActive(item) // 切换路由时导航高亮
    }
}