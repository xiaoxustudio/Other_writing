/*
 * @Author: xuran
 * @LastEditTime: 2023-05-29 13:22:01
 * @Description: file content
 */

/* 
定义轮番动画类：
实现动画轮番

这个类我们打算实现以下功能：
元素加入到队列、应用动画
*/
class AnimationD {
    constructor(sz) {
        this.num = 0
        this.queue_array = []
        this.img = []
    }

    /**
     * @description: 组件加入到队列
     * @param {*} ele 组件列表
     * @param {*} sz 数据
     * @return {*}
     */
    insertQueue = function (ele, sz) {
        for (var i in ele) {
            if (ele[i] instanceof HTMLElement) {
                var view_a = ele[i]
                var arr = new Object()
                arr.element = sz.element || document.body
                arr.duration = sz.duration || 1
                this.queue_array[++this.num] = { "e": view_a, "a": arr }
            }
        }
    }

    /**
     * @description: 动画应用
     * @return {*}
     */
    AnimationApply = function () {
        var promise_k = new Promise((resolve, reject) => {
            resolve("ok")
        }).then((err) => {
            var pro_local = new Promise((resolve, reject) => {
                resolve("ok")
            })
            for (var i in this.queue_array) {
                this.queue_array[i].e.animate([
                    { opacity: 1 },
                    { opacity: 0 },
                    { opacity: 0 },
                    { opacity: 1 },
                ], this.queue_array[i].a.duration)
                pro_local.then((err) => {
                    // 应用图片
                    this.queue_array[i].e.childNodes[0].childNodes[0].setAttribute("src", this.img[index_lunfan])
                })
            }
        })
    }
}




/**
定义自动时间类
每段事件执行相应事件

类功能：
定时器的开始，结束，每段执行什么方法事件
 */
class AutoTime {
    constructor() {
        this.queue_array = []
        this.Timer = null
        this.is_run = false
        this.index = 0
        this.delay = 1000
        this.stopall = false
        this.every = false
        this.num = 0
    }
    /**
     * @description: 增加事件
     * @param function event 事件对象
     * @return {*}
     */
    AddEvent(event) {
        this.queue_array.push(event)
    }
    Start() {
        if (this.is_run) { return }
        var prom = new Promise((resolve, reject) => {
            resolve("ok")
        })

        if (this.every) {
            this.Timer = setInterval(() => {
                if (this.stopall) {
                    this.stopall = false
                    this.Stop()
                } else {
                    if (this.num > this.queue_array.length) {
                        this.num = 0
                    }
                    this.is_run = true
                    if (!this.queue_array[this.num] == undefined) {
                        this.queue_array[this.num]()
                    }
                    this.index += 1
                    this.num++
                }
            }, this.delay)
        } else {
            for (var i = 0; i < this.queue_array.length; i++) {
                if (this.index == i) {
                    prom.then((err) => {
                        if (this.stopall) {
                            this.stopall = false
                            reject("stop")
                        }
                        this.Timer = setTimeout(() => {
                            this.is_run = true
                            this.queue_array[i - 1]()
                            this.index += 1
                        }, this.delay)
                    })
                }
            }
        }
    }


    Stop() {
        if (!this.is_run) { return }
        if (this.every) { clearInterval(this.Timer) }
        clearTimeout(this.Timer)
        this.is_run = false
    }
    StopAll() {
        if (!this.is_run) { return }
        if (this.every) { clearInterval(this.Timer) }
        this.stopall = true
        this.is_run = false
    }
    is_running() {
        if (!this.is_run) { return }
        return this.is_run
    }
    get_run_event() {
        if (!this.is_run) { return }
        return this.queue_array[this.index]
    }
    clear() {
        if (this.is_run) { clearTimeout(this.Timer) }
        this.queue_array = []
        this.Timer = null
        this.is_run = false
        this.index = 0
        this.delay = 1000
        this.every = false
    }
}






/**
 * @description: 查找标题栏指定标题
 * @param {String} node_name 标题内容
 * @return {Void} 
 */
function FindBarNode(node_name) {
    for (let i = 0; i < navObj[0].childElementCount; i++) {
        let cnode = navObj[0].childNodes[i * 2 + 1]
        if (String(cnode.innerText) == String(node_name)) {
            return cnode
        }
    }
    return false
}



/**
 * @description: 开启标题栏下拉事件
 * @param {String} nnode 标题标识
 * @param {Function} func 扩展事件
 * @return {Void}
 */
function EnableOption(nnode, func) {
    let node_obj = FindBarNode(nnode)
    for (let i in document.getElementsByClassName("bar")[0].children) {
        if (document.getElementsByClassName("bar")[0].children[i] instanceof HTMLElement) {
            let node = document.getElementsByClassName("bar")[0].children[i]
            let node_text = node.childNodes[0].innerText
            let dropdown_node = node.childNodes[2] instanceof HTMLElement ? node.childNodes[2] : null
            if (node_text == nnode && dropdown_node) {
                node_obj.childNodes[0].onmouseenter = function (event) {
                        dropdown_node.style.display = "block"
                }
                node_obj.childNodes[0].onmouseleave = function (event) {
                        if (interval) { clearInterval(interval); interval = null }
                        interval = setInterval(() => {
                            if (!mouse_fouce) {
                                dropdown_node.style.display = "none"
                            }
                        }, 1000)
                }
                dropdown_node.onmouseover = function (event) {
                    if (event.fromElement === document.getElementsByClassName("dropdown")[0]) {
                        mouse_fouce = true
                        if (interval) {
                            clearInterval(interval);interval = null
                        }
                    }
                }
                dropdown_node.onmouseleave = function (event) {
                    if (event.fromElement === document.getElementsByClassName("dropdown")[0]) {
                        dropdown_node.style.display = "none"
                        mouse_fouce = false
                        if (interval) {
                            clearInterval(interval);interval = null
                        }
                    }
                }
            }

        }
    }
}



/**
 * @description: 初始化选项
 * @param {JSON} show 初始化数组
 * @return {Void}
 */
function StartOption(show_arr) {
    for (let i in show_arr) {
        let nav_node = FindBarNode(i)
        let content = document.createElement("div")
        content.className = "dropdown"
        for (var ik in show_arr[i]) {
            let item = document.createElement(show_arr[i][ik].type)
            item.className = show_arr[i][ik].className
            item.innerHTML = show_arr[i][ik].innerHTML
            content.appendChild(item)
        }
        nav_node.appendChild(content)
    }
}




// 定义全局数据存储
var point_data = {
    time: 3,
    point: 3,
    p_item: [],
}

// 加载默认点
var default_index = 0

// 定义颜色
var color_default = "background-color: rgba(240, 240, 240, 0.9);"
var color_selected = "background-color: rgba(150, 150, 150, 0.9);"

// 当前轮番索引
var index_lunfan = 0

// 当前导航栏对象
var navObj
var mouse_fouce = false
var interval

// 类实例化
var ani = new AnimationD()
var atimer = new AutoTime()



// 页面加载
window.addEventListener("load", () => {
    var left = document.getElementsByClassName("left-view")
    var right = document.getElementsByClassName("right-view")
    var point_view = document.getElementsByClassName("point")

    navObj = document.getElementsByClassName("bar")
    // 动态创建下拉菜单
    StartOption({
        "宣传": [
            {
                type: "div",
                className: "",
                innerHTML: "宣传1"
            },
            {
                type: "div",
                className: "",
                innerHTML: "宣传2"
            },
            {
                type: "div",
                className: "",
                innerHTML: "宣传3"
            },
        ]
    })

    // 设定轮番动画类图片数组
    ani.img = ["./bj1.jpg", "./bj2.jpg", "./bj3.jpg"]
    // 设定自动轮番
    atimer.delay = 3000
    atimer.every = true
    atimer.AddEvent(() => {
        on_page()
    })
    atimer.Start()
    // 左右翻页按钮事件绑定
    left[0].setAttribute("onclick", "on_page('left')")
    right[0].setAttribute("onclick", "on_page('right')")
    // 创建点
    for (var i = 0; i < point_data.point; i++) {
        var a = document.createElement("li")
        a.setAttribute("class", "point-item")
        a.setAttribute("onclick", "select_point(" + String(i) + ")")
        point_view[0].appendChild(a)
        point_data.p_item[i] = a
    }

    // 给默认点设置颜色
    point_data.p_item[default_index].setAttribute("style", color_selected)

    // 卡片背景定义
    var card_list = document.getElementsByClassName("card-view")

    for (var i in card_list) {
        if (card_list[i] instanceof HTMLElement) {
            card_list[i].setAttribute("style", "background:linear-gradient(to bottom,#40E0D0,#48D1CC) no-repeat right bottom;")
        }
    }

    // 开启标题栏下拉菜单
    EnableOption("宣传", "")
    

})







/**
 * @description 点选择
 * @param Number index
 * @return void
 */
function select_point(index) {
    if (index_lunfan == index) { return }
    if (index >= point_data.point) {
        // 大于
        index = 0
    } else if (index < 0) {
        index = point_data.point + index
    }
    // console.log("轮番点被单击，索引：" + index)
    var nodes = document.getElementsByClassName("point")[0].childNodes
    var lunfan_v = document.getElementsByClassName("lunfan-view")[0].childNodes
    for (var i = 0; i < nodes.length; i++) {
        if (i != index) {
            if (nodes[i] instanceof HTMLElement) {
                nodes[i].setAttribute("style", color_default)
                // 加入动画队列
                ani.insertQueue(lunfan_v, {
                    duration: 500,
                })
            }
        }
    }
    point_data.p_item[index].setAttribute("style", color_selected)
    // 应用动画
    ani.AnimationApply()
    index_lunfan = index

    // 停止轮番，过2秒后开启
    atimer.Stop()
    setTimeout(() => {
        atimer.Start()
    }, 4000)
}


/**
 * @description: 轮番按钮翻页
 * @param {*} direction 方向（left|right【default】）
 * @return void
 */
function on_page(direction = "right") {
    switch (direction) {
        case "right":
            select_point(index_lunfan + 1)
            break
        case "left":
            select_point(index_lunfan - 1)
            break
    }
}












