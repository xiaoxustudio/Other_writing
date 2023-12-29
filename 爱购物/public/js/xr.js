/*
 * @Author: xuranXYS
 * @LastEditTime: 2023-12-27 22:59:39
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
/**
 * @description: template模板标签类
 * @return {*}
 */
class TmpTag {
    constructor(nodes) {
        // 初始化template标签
        let _tmps = []
        this.tmps = []
        this.tmps_dynamic = [] // 动态数据，用于显示for循环节点
        this.wait_tmps = [] // 等待标签
        this.maps = {}
        this._wait = []
        this.for = {} // 存储每次for循环内容数据
        // 首次处理
        // 为顶层for循环打上标签，方便在子孙代码中操作顶层循环
        top_run: for (let it of nodes instanceof Array ? nodes : nodes instanceof HTMLElement ? [nodes] : document.querySelectorAll("template")) {
            let _arr = Object.values(it.attributes)
            for (let ss of _arr) {
                // 是否有no-run标记（运行这个标签需手动调用repeatUpdate方法），有则不进行处理，并加入等待标签
                if (ss.name == "no-run") {
                    let clone_node = it.cloneNode(true)
                    let tmpid = it.attributes["@tmp-id"]
                    this.maps[tmpid.nodeValue] = this.wait_tmps.length
                    this._wait[tmpid.nodeValue] = []
                    it.remove()
                    this.wait_tmps.push(clone_node);
                    continue top_run;
                }
            }
            _tmps.push(it)
        }
        // 二次处理：处理没有no-run的template标签
        for (let it of _tmps) {
            let id = 0
            for (let ik of it.attributes) {
                if (ik.name === "@tmp-id") {
                    this.maps[ik.nodeValue] = this.tmps.length
                    this.tmps.push(it.cloneNode(true))
                    this._wait[ik.nodeValue] = []
                    it.remove()
                    id = ik.nodeValue
                }
                if (ik.name === "@x-for" && id != 0) {
                    // 解析for循环，分为三种情况，遍历 key in obj ，数字 (index,key) in obj ，索引 index in (0,10)
                    let reg = /([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9._]+)/
                    let reg1 = /\(\s*([a-zA-Z0-9._]+)\s*,\s*([a-zA-Z0-9._]+)\s*\)\s+in\s+([a-zA-Z0-9._]+)/
                    let reg2 = /([a-zA-Z0-9._]+)\s+in\s+\((?:\s*([a-zA-Z0-9]+)\s*\,\s*([a-zA-Z0-9]+)\s*|([a-zA-Z0-9]+))\)/
                    // 编译后将函数字符串封装成函数并写入等待
                    // 遍历
                    if (reg.test(ik.nodeValue)) {
                        let match = ik.nodeValue.match(reg)
                        let str_func = `
                    for(${match[1]} in ${match[2]}){
                        let d = {
                            s_node : arguments[0].innerHTML,
                            data : {}
                        }
                        d.data.${match[1]} = ${match[2]}[${match[1]}]
                        arguments[1].push(d)
                    }`
                        this._wait[id].push(new Function(str_func))
                    } else if (reg1.test(ik.nodeValue)) {
                        // key : val
                        let match = ik.nodeValue.match(reg1)
                        let str_func = `
                        for(let i in ${match[3]}){
                            let d = {
                                s_node : arguments[0].innerHTML,
                                data : {}
                            }
                            d.data.${match[1]} = i
                            d.data.${match[2]} = ${match[3]}[i]
                            arguments[1].push(d)
                        }`
                        this._wait[id].push(new Function(str_func))
                    } else if (reg2.test(ik.nodeValue)) {
                        // 索引循环
                        let match = ik.nodeValue.match(reg2)
                        let str_func;
                        if (match[2]) {
                            str_func = `
                            let num = ${match[2]} || 0
                            let num2 = ${match[3]} || 0
                            let _cache ;
                            if(num > ${match[3]}){
                                _cache = num2
                                num2 = num
                                num = _cache
                            }
                            for(let i = num ; i < num2 ; i++){
                                let d = {
                                    s_node : arguments[0].innerHTML,
                                    data : {}
                                }
                                d.data.${match[1]} = i
                                arguments[1].push(d)
                            }`
                        }
                        else {
                            str_func = `
                            let num = ${match[4]} || 0
                            if(num <0){num = 0}
                            for(let i = 0 ; i < num ; i++){
                                let d = {
                                    s_node : arguments[0].innerHTML,
                                    data : {}
                                }
                                d.data.${match[1]} = i
                                arguments[1].push(d)
                            }`}
                        this._wait[id].push(new Function(str_func))
                    } else {
                        throw new Error("for表达式出错：", ik.nodeValue)
                    }
                }
            }
            id = 0
        }
    }
    /**
     * @description: 查找指定属性
     * @param {*} str
     * @return {*}
     */
    findTag(str) {
        for (let i of this.tmps) {
            for (let ik of i.attributes) {
                if (ik.name === str) { return i }
            }
        }
    }
    /**
     * @description: 通过id获取模板
     * @param {*} id
     * @param {*} is_waitTmp 是否为等待标签
     * @return {*}
     */
    get(id, is_waitTmp = false) {
        let elem = is_waitTmp ? this.wait_tmps[this.maps[id]] : this.tmps[this.maps[id]] || this.tmps[this.maps[id]]
        if (elem instanceof HTMLElement) {
            if (elem.attributes["@tmp-id"].nodeValue != id) {
                elem = null
            }
        }
        return elem
    }
    /**
     * @description: 重绘使用标签，配合no-run使用
     * @param {*} node
     * @return {*}
     */
    redraw(node) {
        // 下面的代码和上面初始化时候差不多，这里就不解释了
        if (!node) { return }
        let ids = node.attributes["@use-id"]
        if (!ids) { return }
        let temp = this.get(ids.nodeValue, true)
        for (let it of [temp]) {
            if (!it) { continue }
            let id = ids.nodeValue
            for (let ik of it.attributes) {
                if (ik.name === "@x-for" && id != 0) {
                    let reg = /([a-zA-Z0-9.\[\]]+)\s+in\s+(.+)/
                    let reg1 = /\(\s*([a-zA-Z0-9]+)\s*,\s*([a-zA-Z0-9.\[\]]+)\s*\)\s+in\s+([a-zA-Z0-9.\[\]]+)/
                    let reg2 = /([a-zA-Z0-9._]+)\s+in\s+\((?:\s*([a-zA-Z0-9]+)\s*\,\s*([a-zA-Z0-9]+)\s*|([a-zA-Z0-9]+))\)/
                    // 遍历
                    if (reg.test(ik.nodeValue)) {
                        let match = ik.nodeValue.match(reg)
                        let str_func = `
                    for(${match[1]} in ${match[2]}){
                        let d = {
                            s_node : arguments[0].innerHTML,
                            data : {}
                        }
                        d.data.${match[1]} = ${match[2]}[${match[1]}]
                        arguments[1].push(d)
                    }`
                        this._wait[id].push(new Function(str_func))
                    } else if (reg1.test(ik.nodeValue)) {
                        // key : val
                        let match = ik.nodeValue.match(reg1)
                        let str_func = `
                        for(let i in ${match[3]}){
                            let d = {
                                s_node : arguments[0].innerHTML,
                                data : {}
                            }
                            d.data.${match[1]} = i
                            d.data.${match[2]} = ${match[3]}[i]
                            arguments[1].push(d)
                        }`
                        this._wait[id].push(new Function(str_func))
                    } else if (reg2.test(ik.nodeValue)) {
                        // 索引循环
                        let match = ik.nodeValue.match(reg2)
                        let str_func;
                        if (!match[4]) {
                            str_func = `
                            let num = ${match[2]}
                            let num2 = ${match[3]}
                            let _cache ;
                            if(num > ${match[3]}){
                                _cache = num2
                                num2 = num
                                num = _cache
                            }
                            for(let i = num ; i < num2 ; i++){
                                let d = {
                                    s_node : arguments[0].innerHTML,
                                    data : {}
                                }
                                d.data.${match[1]} = i
                                arguments[1].push(d)
                            }`
                        }
                        else {
                            str_func = `
                            let num = ${match[4]} 
                            if(num <0){num = 0}
                            for(let i = 0 ; i < num ; i++){
                                let d = {
                                    s_node : arguments[0].innerHTML,
                                    data : {}
                                }
                                d.data.${match[1]} = i
                                arguments[1].push(d)
                            }`}
                        this._wait[id].push(new Function(str_func))
                    } else {
                        throw new Error("for表达式出错")
                    }
                }
            }
            id = 0
        }
    }
    /**
     * @description: 运行等待栈
     * @param {*} id  运行id
     * @param {*} env 环境
     * @param {*} parent 父级节点元素
     * @return {*}
     */
    runWait(id, env, parent) {
        for (let i of this._wait[id]) {
            if (i instanceof Function) {
                i.bind(env.data)(parent, this.tmps_dynamic, env)
            }
        }
        // 运行后设置为空数组
        this._wait[id] = []
    }
    /**
     * @description: for数据垃圾回收
     * @param {*} id 要回收的for垃圾id
     * @return {*}
     */
    processGC(id) {
        if (this.for.hasOwnProperty(id)) {
            this.for[id] = undefined
            delete this.for[id]
        }
    }
}
/**
 * @description: 模板类：可实现事件注册、双向绑定等...
 * @return {*}
 */
class Template {
    constructor(obj) {
        let odata = obj.data() || {}
        // 将update的环境设置为本身，方便后续操作
        const update = this.update.bind(this)
        // 垃圾回收
        this.observer = null
        // 可能会用到继承，所以写上
        if (obj instanceof Template) {
            this.TmpTag = obj.TmpTag
            odata = obj.data() || {}
            this.data = obj.data
            this.s_data = obj.s_data
            this.funcs_custom = obj.methods
            for (let ie in this.funcs_custom) {
                this.funcs_custom[ie].bind(this.data)
            }
            this.cache = obj.cache
            this.initupdate()
            return this
        }
        // 创建代理，用于实现类似于vue的双向绑定功能
        this.data = new Proxy(odata, {
            get(o, p) { return o[p] },
            set(o, p, v) { o[p] = v; /*使用异步更新*/window.setTimeout(update(), 0); return true; }
        })
        // 创建静态数据(不会被更改)，后续会用到
        this.s_data = obj.s_data?.bind(this.data)() || (function () { return {} }).bind(this.data)()
        // 创建方法
        this.funcs_custom = obj.methods
        for (let ie in this.funcs_custom) {
            this.funcs_custom[ie].bind(this.data)
        }
        // 创建缓存，这里使用map是因为后续会让元素作为key
        this.cache = new Map()
        // 事件绑定列表
        this.funcs_custom_map = new Map()
        // 修改继承事件列表
        Element.prototype._addEventListener = Element.prototype.addEventListener;
        Element.prototype.addEventListener = function (type, listeners, options) {
            if (options == void 0)
                options = false;
            this._addEventListener(type, listeners, options);
            if (!window.app.funcs_custom_map.has(this)) {
                window.app.funcs_custom_map.set(this, {})
            }
            if(!window.app.funcs_custom_map.get(this)[type]){
                window.app.funcs_custom_map.get(this)[type] = []
            }
            window.app.funcs_custom_map.get(this)[type].push({ type, listener: listeners })
        }
        Element.prototype._removeEventListener = Element.prototype.removeEventListener;
        Element.prototype.removeEventListener = function (type, listeners) {
            this._removeEventListener(type, listeners);
            if (window.app.funcs_custom_map.has(this)) {
                let stack = window.app.funcs_custom_map.get(this)[type]
                if (stack instanceof Array && stack.indexOf({ type, listener: listeners }) !== -1) {
                    delete stack[type][stack.indexOf({ type, listener: listeners })]
                }
            }
        };
        // dom加载完成时初始化
        window.addEventListener("DOMContentLoaded", () => {
            this.TmpTag = new TmpTag()
            this.initupdate()
        })
        window.app = this
        return this
    }
    /**
     * @description: 生成随机id
     * @return {*}
     */
    cr_id() {
        return Math.random().toString(36).padEnd(2, "0").substring(2, 9);
    }
    /**
     * @description: 获取指定元素的全部同级元素
     * @param {*} element
     * @return {*}
     */
    getSiblings(element) {
        let siblings = []
        // 获取父元素的子节点列表
        if (element.parentNode) { siblings = Array.from(element.parentNode.children || []); }
        return siblings;
    }
    /**
     * @description: 获取if或者else或else-if节点
     * @param {*} node 节点
     * @param {*} type 获取属性类型
     * @param {*} show_all 是否显示全部（默认返回首次找到的元素）
     * @param {*} reverse 是否向前寻找 （默认向后查找）
     * @return {Array<HTMLElement>|null} 返回找到的节点
     */
    getIFtoElse(node, type = "@x-else", show_all = false, reverse = false) {
        let _arr = []
        let _aarr = this.getSiblings(node)
        let arr;
        if (reverse) {
            // 向前查找
            arr = _aarr.slice(0, _aarr.indexOf(node) + 1)
            for (let i = arr.length - 1; i > 0; i--) {
                let no = arr[i]
                let attrs = Object.keys(no.attributes)
                for (let ik of attrs) {
                    let key_name = attrs[ik]
                    let item = no.attributes[key_name]
                    if ((no.attributes["@x-else"] || no.attributes["@x-if"]) && no.attributes["use-template"]
                        && no.attributes["use-template"] !== "false") {
                        return show_all ? _arr : i
                    }
                    // 保证有use-template
                    if (item.name === type && attrs.length > 0 && no.attributes["use-template"] && no.attributes["use-template"] !== "false") {
                        if (show_all) {
                            _arr.push(no)
                            continue
                        }
                        return no
                    }
                }
            }
        } else {
            // 向后查找
            arr = _aarr.slice(_aarr.indexOf(node) + 1)
            for (let i of arr) {
                let attrs = Object.keys(i.attributes)
                for (let ik of attrs) {
                    let key_name = attrs[ik]
                    let item = i.attributes[key_name]
                    if ((i.attributes["@x-else"] || i.attributes["@x-if"]) && i.attributes["use-template"]
                        && i.attributes["use-template"] !== "false") {
                        return show_all ? _arr : i
                    }
                    // 保证有use-template
                    if (item.name === type && attrs.length > 0
                        && i.attributes["use-template"]
                        && i.attributes["use-template"] !== "false") {
                        if (show_all) {
                            _arr.push(i)
                            continue
                        }
                        return i
                    }
                }
            }
        }
        return show_all ? _arr : null
    }
    /**
     * @description: 初始化
     * @return {*}
     */
    initupdate() {
        // 查找全部使用了use-template的标签
        let $all = document.querySelectorAll("[use-template]")
        for (let i of $all) {
            // 解析@绑定
            let attrs = Object.keys(i.attributes)
            for (let ik in attrs) {
                let key_name = attrs[ik]
                let item = i.attributes[key_name]
                let is_rep = true // 替换模板字符串
                const com = (node, tmp) => {
                    // 更新模板字符串
                    // 创建该节点的文本迭代器
                    const iterator = document.createNodeIterator(node, NodeFilter.SHOW_TEXT);
                    let textNode;
                    while (textNode = iterator.nextNode()) {
                        // 模板属性，确保元素没有首次加入过
                        if (/\{\{([^}}]+)\}\}/g.test(textNode.nodeValue) && !this.cache.has(textNode.parentNode) && textNode.parentNode.attributes["use-template"]?.nodeValue == '') {
                            let id_node = this.upproperty(textNode, "for_id")
                            // 替换{{ ... }}字符串
                            textNode.nodeValue = textNode.nodeValue.replace(/\{\{([^}}]+)\}\}/g, (match, val, ind) => {
                                // 设置键值，因为我们之前用的是Map，所以键可以为任何对象
                                tmp.cache.set(textNode.parentNode, { text: textNode.nodeValue, textNode })
                                // 替换$...为arguments[0]....
                                val = val.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                    return "arguments[0]." + v
                                })
                                // 判断是否找到了for_id找到了使用它的作用域，没有则使用静态数据
                                let sdata = this.s_data
                                if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                    sdata = this.TmpTag.for[id_node.for_id]
                                }
                                // 运行编译并返回
                                return new Function("return " + val.trim()).bind(this.data, sdata)()
                            })
                        }
                    }
                }
                // 确保为@开头且有use-template属性
                if (item.name.startsWith("@") && attrs.length > 0 && i.attributes["use-template"] && i.attributes["use-template"] !== "false") {
                    // 内置属性
                    if (item.name === "@use-id") {
                        // 使用template模板
                        // 获取指定模板数据
                        let tmp = this.TmpTag.get(item.nodeValue)
                        // 确保其id存在
                        if (tmp && this.TmpTag._wait[item.nodeValue]) {
                            if (this.TmpTag._wait[item.nodeValue].length > 0) {
                                // 解析并运行将当前节点和当前this还有模板的内容解析传入
                                this.TmpTag.runWait(item.nodeValue, this, new DOMParser().parseFromString(tmp.innerHTML, "text/html").body)
                                // 遍历动态数据
                                for (let i_item of this.TmpTag.tmps_dynamic) {
                                    // 我们只要第一个就可以
                                    let sub_node = new DOMParser().parseFromString(i_item.s_node, "text/html").body.children[0]
                                    // 创建for循环的id，循环的时候需要用到
                                    let id = this.cr_id()
                                    sub_node.for_id = id
                                    // 解析for属性
                                    for (let f_it in i_item.data) {
                                        if (!this.TmpTag.for[id]) {
                                            this.TmpTag.for[id] = {}
                                        }
                                        // 将循环的数据存储
                                        this.TmpTag.for[id][f_it] = i_item.data[f_it]
                                    }
                                    //其他存储
                                    this.TmpTag.for[id]["self"] = sub_node
                                    this.TmpTag.for[id]["parent"] = sub_node
                                    // 添加编译后的节点
                                    i.appendChild(sub_node)
                                    // 垃圾回收
                                    if (!(this.observer instanceof MutationObserver)) {
                                        this.observer = new MutationObserver((obj) => {
                                            let keys = Object.keys(this.TmpTag.for)
                                            for (let item of keys) {
                                                let it = this.TmpTag.for[item]
                                                if (!document.contains(it.self)) {
                                                    this.TmpTag.processGC(it.self.for_id)
                                                }
                                            }
                                        })
                                        this.observer.observe(document.body, {
                                            childList: true, // 观察目标子节点的变化，是否有添加或者删除
                                            subtree: true, // 针对整个子树生效
                                        })
                                    }
                                    // 重回这个编译的节点
                                    this.repeatupdate(sub_node)
                                    is_rep = false // 不替换，上面的repeatupdate会帮我们替换
                                }
                            } else {
                                // 如果不是for循环，则直接添加即可
                                // 使用默认模板功能
                                let sub_node = new DOMParser().parseFromString(tmp.innerHTML, "text/html").body.children[0]
                                i.appendChild(sub_node)
                                this.repeatupdate(sub_node)
                                is_rep = false
                            }
                            this.TmpTag.tmps_dynamic = [] // 最后清空动态数据
                        }
                    } else if (item.name === "@x-if") {
                        // 设置默认结果为false
                        let status = false
                        // 保证使用了use-template
                        if (i.attributes["use-template"] && i.attributes["use-template"] !== "false") {
                            // 模板属性
                            let id_node = this.upproperty(i, "for_id")
                            item.nodeValue.replace(/(.*)/, (match, val, ind) => {
                                val = match.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                    return "arguments[0]." + v
                                })
                                let sdata = this.s_data
                                if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                    sdata = this.TmpTag.for[id_node.for_id]
                                }
                                status = new Function("return " + val.trim()).bind(this.data, sdata)()
                                return status
                            })
                        }
                        // 运行
                        const run = (node) => {
                            let _res = false
                            for (let ite of node.attributes) {
                                if (ite.name === "@x-else-if") {
                                    // 模板属性
                                    let id_node = this.upproperty(node, "for_id")
                                    let val = ite.nodeValue.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                        return "arguments[0]." + v
                                    })
                                    let sdata = this.s_data
                                    if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                        sdata = this.TmpTag.for[id_node.for_id]
                                    }
                                    _res = new Function("return " + val.trim()).bind(this.data, sdata)()
                                }
                            }
                            return _res
                        }
                        // 创建匿名函数，用于循环设置if，直到找不到为止
                        const r_if_wihle = (node, action_value = "null", val = false) => {
                            let res = null
                            let sun_node_else_if = this.getIFtoElse(node, "@x-else-if")
                            if (sun_node_else_if) {
                                if (val) {
                                    // 上次已经有运行成功了
                                    sun_node_else_if.style.display = action_value
                                    return r_if_wihle(sun_node_else_if, action_value, true)
                                }
                                res = run(sun_node_else_if)
                                if (res) {
                                    sun_node_else_if.style.display = null
                                } else {
                                    sun_node_else_if.style.display = action_value
                                }
                                return r_if_wihle(sun_node_else_if, action_value, res)
                            } else if (!val) {
                                // 如果到最后val值还是为false且已经找不到else-if了，那就设置else
                                let selse = this.getIFtoElse(node)
                                if (selse instanceof HTMLElement) {
                                    selse.style.display = null
                                }
                            }
                            return res == null ? val : res
                        }
                        // 判断运行后的结果是否为true
                        let node_else_if = this.getIFtoElse(i, "@x-else-if")
                        if (status) {
                            i.style.display = null
                            let node_else = this.getIFtoElse(i)
                            if (node_else instanceof HTMLElement) {
                                node_else.style.display = "none"
                            }
                            // 之间的else-if
                            r_if_wihle(i, "none", true)
                        } else if (this.getIFtoElse(i, "@x-else-if") instanceof HTMLElement && node_else_if && run(node_else_if)) {
                            i.style.display = "none"
                            // 执行
                            node_else_if.style.display = null
                            r_if_wihle(node_else_if, "none", true)
                            let node_else = this.getIFtoElse(i)
                            if (node_else instanceof HTMLElement) {
                                node_else.style.display = "none"
                            }
                        } else if (this.getIFtoElse(i, "@x-else-if") instanceof HTMLElement && node_else_if && !run(node_else_if)) {
                            i.style.display = "none"
                            // 执行
                            node_else_if.style.display = "none"
                            let res = r_if_wihle(node_else_if, "none", false)
                            let node_else = this.getIFtoElse(i)
                            if (res) {
                                if (node_else instanceof HTMLElement) {
                                    node_else.style.display = "none"
                                }
                            } else {
                                if (node_else instanceof HTMLElement) {
                                    node_else.style.display = null
                                }
                            }
                        } else {
                            i.style.display = "none"
                            // 之间的else-if
                            r_if_wihle(i, "none", true)
                            let node_else = this.getIFtoElse(i)
                            if (node_else instanceof HTMLElement) {
                                node_else.style.display = null
                            }
                        }
                    }else{
                                            //自定义方法
                    try {
                        let func_name = item.value
                        // 模板属性
                        let reg = /([a-zA-Z0-9.\[\]\$\_]+)\((.*)\)$/i
                        let arr = []
                        // 判断是否是传参函数，是的话，将函数名称进行编译
                        if (reg.test(func_name)) {
                            let _arr = func_name.match(reg)
                            func_name = _arr[1]
                            _arr[0] = null
                            _arr[1] = null
                            let id_node = this.upproperty(i, "for_id")
                            for (let mi of _arr) {
                                if (mi) {
                                    mi = mi.replace(/^[\$]\$([0-9a-zA-Z.\_\-\[\]\"\']+)/g, (ma, v) => {
                                        return "arguments[0]." + v
                                    })
                                    if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                        mi = new Function("return " + mi.trim()).bind(this.data, this.TmpTag.for[id_node.for_id])()
                                    }
                                    arr.push(mi)
                                }
                            }
                        }
                        let is_ori = false // 是否是自身函数
                        // 判断函数名称是否存在
                        if (this.funcs_custom[func_name]) {
                            func_name = this.funcs_custom[func_name]
                            is_ori = true
                        }
                        // 判断是否有参数，并绑定事件
                        if (!this.funcs_custom_map.has(i)) {
                            if (arr.length > 0) {
                                if (is_ori) {
                                    let fn = func_name.bind(this.data, ...arr)
                                    i.addEventListener(item.name.substring(1), fn);
                                } else {
                                    let fn = new Function(item.value).bind(this.data, ...arr)
                                    i.addEventListener(item.name.substring(1), fn);
                                }
                            } else {
                                try {
                                    if (is_ori) {
                                        let fn = func_name.bind(this.data)
                                        i.addEventListener(item.name.substring(1), fn);
                                    } else {
                                        let fn = new Function("return " + item.value).bind(this.data)
                                        i.addEventListener(item.name.substring(1), fn);
                                    }
                                } catch (e) {
                                    let fn = new Function(item.value).bind(this.data)
                                    i.addEventListener(item.name.substring(1), fn);
                                }
                            }
                        }
                    } catch (e) { }
                    }
                }
                if (is_rep || /(\$|this)+(['\[\]a-zA-Z0-9\.\_\-])+/g.test(item.nodeValue)) {
                    // 编译
                    com(i, this)
                    // 模板属性
                    let id_node = this.upproperty(i, "for_id")
                    // 如果设置了no-replace，则只运行，但不替换内容
                    if (i.attributes["no-replace"] && i.attributes["no-replace"] !== "false") {
                        item.nodeValue.replace(/(\$|this)+(['\[\]a-zA-Z0-9\.\_\-])+/g, (match, val, ind) => {
                            val = match.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                return "arguments[0]." + v
                            })
                            let sdata = this.s_data
                            if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                sdata = this.TmpTag.for[id_node.for_id]
                            }
                            return new Function("return " + val.trim()).bind(this.data, sdata)()
                        })
                    } else {
                        item.nodeValue = item.nodeValue.replace(/(\$|this)+(['\[\]a-zA-Z0-9\.\_\-])+/g, (match, val, ind) => {
                            val = match.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                return "arguments[0]." + v
                            })
                            let sdata = this.s_data
                            if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                sdata = this.TmpTag.for[id_node.for_id]
                            }
                            return new Function("return " + val.trim()).bind(this.data, sdata)()
                        })
                    }
                }
            }
        }
    }
    /**
     * @description: 查找指定节点属性
     * @param {*} node 节点
     * @param {*} str 属性
     * @param {*} direction 方向 1 || -1
     * @return {HTMLElement}
     */
    upattr(node, str, direction = 1) {
        let pnode = node
        try {
            let attrs = Object.values(pnode.attributes)
            for (let attr of attrs) {
                if (attr.name === str) {
                    return pnode
                }
            }
            let narr = direction > 0 ? pnode.parentNode : pnode.children
            if (narr instanceof HTMLElement) { return this.upattr(pnode.parentNode, str, direction) } else {
                for (let i of narr) {
                    let res = this.upattr(i, str, direction)
                    if (res instanceof HTMLElement) return res
                }
            }
            return -1
        } catch (e) { return -1 }

    }
    /**
     * @description: 查找指定节点对象属性
     * @param {*} node 节点
     * @param {*} property 属性
     * @param {*} direction 方向 1（默认） || -1
     * @return {*}
     */
    upproperty(node, property, direction = 1) {
        let pnode = node
        try {
            if (!pnode.hasOwnProperty(property)) {
                let narr = direction > 0 ? pnode.parentNode : pnode.children
                if (narr instanceof HTMLElement) { return this.upproperty(narr, property, direction) } else {
                    for (let i of narr) {
                        let res = this.upproperty(i, property, direction)
                        if (res instanceof HTMLElement) return res
                    }
                }
                return -1
            }
            return pnode
        } catch (e) { return -1 }
    }
    /**
     * @description: 重新更新节点
     * @param {*} node 节点
     * @param {*} is_redraw 是否重绘
     * @param {*} is_wait 是否为等待
     * @return {*}
     */
    repeatupdate(node, is_redraw = false, is_wait = false) {
        // 和initupdate差不多，这里就跳过解读这个方法
        if (!(node instanceof HTMLElement)) { return false }
        let $all = [... new Set([node, ...node.querySelectorAll("[use-template]")])]
        for (let i of $all) {
            // 解析@绑定
            let attrs = Object.keys(i.attributes)
            for (let ik in attrs) {
                let item = i.attributes[ik]
                let is_rep = true // 替换模板字符串
                const com = (node, tmp) => {
                    // 更新模板字符串
                    const iterator = document.createNodeIterator(node, NodeFilter.SHOW_TEXT);
                    let textNode;
                    while (textNode = iterator.nextNode()) {
                        // 模板属性
                        if (/\{\{([^}}]+)\}\}/g.test(textNode.nodeValue) && !this.cache.has(textNode.parentNode) && textNode.parentNode.attributes["use-template"]?.nodeValue == '') {
                            let id_node = this.upproperty(textNode, "for_id")
                            textNode.nodeValue = textNode.nodeValue.replace(/\{\{([^}}]+)\}\}/g, (match, val, ind) => {
                                tmp.cache.set(textNode.parentNode, { text: textNode.nodeValue, textNode })
                                val = val.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                    return "arguments[0]." + v
                                })
                                let sdata = this.s_data
                                if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                    sdata = this.TmpTag.for[id_node.for_id]
                                }
                                return new Function("return " + val.trim()).bind(this.data, sdata)()
                            })
                        }
                    }
                }
                if (item.name.startsWith("@") && attrs.length > 0 && i.attributes["use-template"] && i.attributes["use-template"] !== "false") {
                    // 内置属性
                    if (item.name === "@use-id") {
                        // 使用template模板
                        let tmp = this.TmpTag.get(item.nodeValue)
                        if (tmp && this.TmpTag._wait[item.nodeValue]) {
                            if (this.TmpTag._wait[item.nodeValue].length > 0) {
                                this.TmpTag.runWait(item.nodeValue, this, new DOMParser().parseFromString(tmp.innerHTML, "text/html").body)
                                for (let i_item of this.TmpTag.tmps_dynamic) {
                                    let sub_node = new DOMParser().parseFromString(i_item.s_node, "text/html").body.children[0]
                                    let id = this.cr_id()
                                    sub_node.for_id = id
                                    // 解析for遍历属性
                                    for (let f_it in i_item.data) {
                                        if (!this.TmpTag.for[id]) {
                                            this.TmpTag.for[id] = {}
                                        }
                                        this.TmpTag.for[id][f_it] = i_item.data[f_it]
                                    }
                                    //其他存储
                                    this.TmpTag.for[id]["self"] = sub_node
                                    this.TmpTag.for[id]["parent"] = sub_node
                                    i.appendChild(sub_node)
                                    // 垃圾回收
                                    if (!(this.observer instanceof MutationObserver)) {
                                        this.observer = new MutationObserver((obj) => {
                                            let keys = Object.keys(this.TmpTag.for)
                                            for (let item of keys) {
                                                let it = this.TmpTag.for[item]
                                                if (!document.contains(it.self)) {
                                                    this.TmpTag.processGC(it.self.for_id)
                                                }
                                            }
                                        })
                                        this.observer.observe(document.body, {
                                            childList: true, // 观察目标子节点的变化，是否有添加或者删除
                                            subtree: true, // 针对整个子树生效
                                        })
                                    }
                                    this.repeatupdate(sub_node)
                                }
                            } else {
                                // 使用默认模板功能
                                let sub_node = new DOMParser().parseFromString(tmp.innerHTML, "text/html").body.children[0]
                                i.appendChild(sub_node)
                                this.repeatupdate(sub_node)
                                is_rep = false
                                this.TmpTag.tmps_dynamic = []
                            }
                            this.TmpTag.tmps_dynamic = []
                        }
                    } else if (item.name === "@x-if") {
                        let status = false
                        if (i.attributes["use-template"] && i.attributes["use-template"] !== "false") {
                            setTimeout(() => com(i, this), 0)
                            // 模板属性
                            let id_node = this.upproperty(i, "for_id")
                            item.nodeValue.replace(/(.*)/, (match, val, ind) => {
                                val = match.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                    return "arguments[0]." + v
                                })
                                let sdata = this.s_data
                                if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                    sdata = this.TmpTag.for[id_node.for_id]
                                }
                                status = new Function("return " + val.trim()).bind(this.data, sdata)()
                                return status
                            })
                        }
                        const run = (node) => {
                            let _res = false
                            for (let ite of node.attributes) {
                                if (ite.name === "@x-else-if") {
                                    // 模板属性
                                    let id_node = this.upproperty(node, "for_id")
                                    let val = ite.nodeValue.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                        return "arguments[0]." + v
                                    })
                                    let sdata = this.s_data
                                    if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                        sdata = this.TmpTag.for[id_node.for_id]
                                    }
                                    _res = new Function("return " + val.trim()).bind(this.data, sdata)()
                                }
                            }
                            return _res
                        }
                        const r_if_wihle = (node, action_value = "null", val = false) => {
                            let res = null
                            let sun_node_else_if = this.getIFtoElse(node, "@x-else-if")
                            if (sun_node_else_if) {
                                if (val) {
                                    // 上次已经有运行成功了
                                    sun_node_else_if.style.display = action_value
                                    return r_if_wihle(sun_node_else_if, action_value, true)
                                }
                                res = run(sun_node_else_if)
                                if (res) {
                                    sun_node_else_if.style.display = null
                                } else {
                                    sun_node_else_if.style.display = action_value
                                }
                                return r_if_wihle(sun_node_else_if, action_value, res)
                            } else if (!val) {
                                // 如果到最后val值还是为false且已经找不到else-if了，那就设置else
                                let selse = this.getIFtoElse(node)
                                if (selse instanceof HTMLElement) {
                                    selse.style.display = null
                                }
                            }
                            return res == null ? val : res
                        }
                        let node_else_if = this.getIFtoElse(i, "@x-else-if")
                        if (status) {
                            i.style.display = null
                            let node_else = this.getIFtoElse(i)
                            if (node_else instanceof HTMLElement) {
                                node_else.style.display = "none"
                            }
                            // 之间的else-if
                            r_if_wihle(i, "none", true)
                        } else if (this.getIFtoElse(i, "@x-else-if") instanceof HTMLElement && node_else_if && run(node_else_if)) {
                            i.style.display = "none"
                            // 执行
                            node_else_if.style.display = null
                            r_if_wihle(node_else_if, "none", true)
                            let node_else = this.getIFtoElse(i)
                            if (node_else instanceof HTMLElement) {
                                node_else.style.display = "none"
                            }
                        } else if (this.getIFtoElse(i, "@x-else-if") instanceof HTMLElement && node_else_if && !run(node_else_if)) {
                            i.style.display = "none"
                            // 执行
                            node_else_if.style.display = "none"
                            let res = r_if_wihle(node_else_if, "none", false)
                            let node_else = this.getIFtoElse(i)
                            if (res) {
                                if (node_else instanceof HTMLElement) {
                                    node_else.style.display = "none"
                                }
                            } else {
                                if (node_else instanceof HTMLElement) {
                                    node_else.style.display = null
                                }
                            }
                        } else {
                            i.style.display = "none"
                            // 之间的else-if
                            r_if_wihle(i, "none", true)
                            let node_else = this.getIFtoElse(i)
                            if (node_else instanceof HTMLElement) {
                                node_else.style.display = null
                            }
                        }
                    }else{
                                            //自定义方法
                    try {
                        let func_name = item.value
                        // 模板属性
                        let reg = /([a-zA-Z0-9.\[\]\$\_]+)\((.*)\)$/i
                        let arr = []
                        if (reg.test(func_name)) {
                            let _arr = func_name.match(reg)
                            func_name = _arr[1]
                            _arr[0] = null
                            _arr[1] = null
                            let id_node = this.upproperty(i, "for_id")
                            for (let mi of _arr) {
                                if (mi) {
                                    mi = mi.replace(/\$([0-9a-zA-Z.\_\-\[\]\"\']+)/g, (ma, v) => {
                                        return "arguments[0]." + v
                                    })
                                    if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                        mi = new Function("return " + mi.trim()).bind(this.data, this.TmpTag.for[id_node.for_id])()
                                    }
                                    arr.push(mi)
                                }
                            }
                        }
                        let is_ori = false // 是否是自身函数
                        if (this.funcs_custom[func_name]) {
                            func_name = this.funcs_custom[func_name]
                            is_ori = true
                        }
                        if (!this.funcs_custom_map.has(i)) {
                            if (arr.length > 0) {
                                if (is_ori) {
                                    let fn = func_name.bind(this.data, ...arr)
                                    i.addEventListener(item.name.substring(1), fn);
                                } else {
                                    let fn = new Function(item.value).bind(this.data, ...arr)
                                    i.addEventListener(item.name.substring(1), fn);
                                }
                            } else {
                                try {
                                    if (is_ori) {
                                        let fn = func_name.bind(this.data)
                                        i.addEventListener(item.name.substring(1), fn);
                                    } else {
                                        let fn = new Function("return " + item.value).bind(this.data)
                                        i.addEventListener(item.name.substring(1), fn);
                                    }
                                } catch (e) {
                                    let fn = new Function(item.value).bind(this.data)
                                    i.addEventListener(item.name.substring(1), fn);
                                }
                            }
                        }
                    } catch (e) { }
                    }
                }
                if (is_rep || /(\$|this)+(['\[\]a-zA-Z0-9\.\_\-])+/g.test(item.nodeValue)) {
                    setTimeout(() => com(i, this), 0)
                    // 内置属性运行
                    // 模板属性
                    let id_node = this.upproperty(i, "for_id")
                    if (i.attributes["no-replace"] && i.attributes["no-replace"] !== "false") {
                        item.nodeValue.replace(/(\$|this)+(['\[\]a-zA-Z0-9\.\_\-])+/g, (match, val, ind) => {
                            val = match.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                return "arguments[0]." + v
                            })
                            let sdata = this.s_data
                            if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                sdata = this.TmpTag.for[id_node.for_id]
                            }
                            return new Function("return " + val.trim()).bind(this.data, sdata)()
                        })
                    } else {
                        item.nodeValue = item.nodeValue.replace(/(\$|this)+(['\[\]a-zA-Z0-9\.\_\-])+/g, (match, val, ind) => {
                            val = match.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                return "arguments[0]." + v
                            })
                            let sdata = this.s_data
                            if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                sdata = this.TmpTag.for[id_node.for_id]
                            }
                            return new Function("return " + val.trim()).bind(this.data, sdata)()
                        })
                    }
                }
            }
            // 重绘制
            if (is_redraw) {
                let item = i.attributes["@use-id"]
                if (!item) { continue }
                i.innerHTML = ""
                // 取消垃圾回收
                if (this.observer instanceof MutationObserver) {
                    this.observer.disconnect()
                    this.observer = null
                }
                this.TmpTag.redraw(i)
                // 使用template模板
                // 和上面for解析代码差不多，也不多解释
                let tmp = this.TmpTag.get(item.nodeValue, is_wait)
                if (tmp && this.TmpTag._wait[item.nodeValue]) {
                    if (this.TmpTag._wait[item.nodeValue].length > 0) {
                        this.TmpTag.runWait(item.nodeValue, this, new DOMParser().parseFromString(tmp.innerHTML, "text/html").body)
                        for (let i_item of this.TmpTag.tmps_dynamic) {
                            let sub_node = new DOMParser().parseFromString(i_item.s_node, "text/html").body.children[0]
                            let id = this.cr_id()
                            sub_node.for_id = id
                            // 解析for属性
                            for (let f_it in i_item.data) {
                                if (!this.TmpTag.for[id]) {
                                    this.TmpTag.for[id] = {}
                                }
                                this.TmpTag.for[id][f_it] = i_item.data[f_it]
                            }
                            //其他存储
                            this.TmpTag.for[id]["self"] = sub_node
                            this.TmpTag.for[id]["parent"] = sub_node
                            i.appendChild(sub_node)
                            this.repeatupdate(sub_node)
                        }
                    } else {
                        // 使用默认模板功能
                        let sub_node = new DOMParser().parseFromString(tmp.innerHTML, "text/html").body.children[0]
                        i.appendChild(sub_node)
                        this.repeatupdate(sub_node)
                    }
                    this.TmpTag.tmps_dynamic = []
                }
            }
        }
        return this
    }
    /**
     * @description: 更新模板字符串
     * @param {*} node 节点
     * @return {*}
     */
    update(node = null) {
        // 其实上面也讲过只不过这里加了是否为父节点的判断，也不多做解释
        for (const [key, value] of this.cache.entries()) {
            // 更新模板字符串
            const iterator = document.createNodeIterator(key, NodeFilter.SHOW_TEXT);
            let textNode;
            while (textNode = iterator.nextNode()) {
                // 模板属性
                if (/\{\{([^}}]+)\}\}/g.test(value.text) && key === textNode.parentNode && textNode == value.textNode && textNode.parentNode.attributes["use-template"]?.nodeValue == '') {
                    if (node && node instanceof HTMLElement && textNode.parentNode === node) {
                        let id_node = this.upproperty(textNode, "for_id")
                        textNode.nodeValue = value.text.replace(/\{\{([^}}]+)\}\}/g, (match, val, ind) => {
                            val = val.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                                return "arguments[0]." + v
                            })
                            let sdata = this.s_data
                            if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                                sdata = this.TmpTag.for[id_node.for_id]
                            }
                            return new Function("return " + val.trim()).bind(this.data, sdata)()
                        })
                        return;
                    }
                    let id_node = this.upproperty(textNode, "for_id")
                    textNode.nodeValue = value.text.replace(/\{\{([^}}]+)\}\}/g, (match, val, ind) => {
                        val = val.replace(/\$([0-9a-zA-Z.\_\-\[\]]+)/g, (ma, v) => {
                            return "arguments[0]." + v
                        })
                        let sdata = this.s_data
                        if (id_node !== -1 && id_node !== void 0 && id_node !== null) {
                            sdata = this.TmpTag.for[id_node.for_id]
                        }
                        return new Function("return " + val.trim()).bind(this.data, sdata)()
                    })
                }
            }
        }
        if (node instanceof HTMLElement) { setTimeout(this.repeatupdate(node?.parentNode), 0) }
    }
    /**
     * @description: 调用template函数
     * @param {*} func
     * @param {Array} args
     * @return {*}
     */
    callv(func, ...args) {
        if (this.funcs_custom.hasOwnProperty(func)) {
            this.funcs_custom[func].bind(this.data)(...args)
        }
        return this
    }
    /**
     * @description: 获取指定template函数
     * @param {*} func
     * @return {*}
     */
    getMethod(func) {
        if (this.funcs_custom.hasOwnProperty(func)) {
            return this.funcs_custom[func]
        }
        return this
    }
    then(callback = () => { }) {
        if (callback instanceof Function) callback()
    }
}
/**
 * @description: URL参数解析
 * @return {*}
 */
class URL_Param {
    constructor(url) {
        const urlSearchParams = new URLSearchParams(url);
        const params = Object.fromEntries(urlSearchParams.entries());
        return params
    }
}
