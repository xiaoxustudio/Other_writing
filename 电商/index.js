/*
 * @Author: xuranXYS
 * @LastEditTime: 2023-06-17 15:07:06
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
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
                    dropdown_node.style.left = (node_obj.offsetLeft + 30) + "px"
                    console.log(dropdown_node)
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
                            clearInterval(interval); interval = null
                        }
                    }
                }
                dropdown_node.onmouseleave = function (event) {
                    if (event.fromElement === document.getElementsByClassName("dropdown")[0]) {
                        dropdown_node.style.display = "none"
                        mouse_fouce = false
                        if (interval) {
                            clearInterval(interval); interval = null
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
            item.style.paddingLeft = "20px"
            item.style.paddingRight = "20px"
            content.appendChild(item)
        }
        nav_node.appendChild(content)
    }
}





let message_o = null
function show_error(text) {
    let show_node = document.getElementsByClassName("error-message")[0]
    show_node.style.display = "block"
    show_node.innerText = text
    clearInterval(message_o)
    message_o = setInterval(() => {
        show_node.style.display = "none"
    }, 800);
}


/**
 * @description: 计算时间
 * @return {Void}
 */
function calc_time() {
    // 获取距离倒计时结束还剩余的毫秒数
    const remainingTime = targetTime - new Date().getTime();

    // 计算剩余时间的小时、分钟和秒数
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    // 将计算结果显示在页面上
    document.getElementById('countdown1').innerHTML = `${hours}`;
    document.getElementById('countdown2').innerHTML = `${minutes}`;
    document.getElementById('countdown3').innerHTML = ` ${seconds}`;
}









/**
 * @description 点选择
 * @param Number index 页面索引
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




// 获取倒计时结束时间点（当前时间点 + 24小时）
const targetTime = new Date().getTime() + 24 * 60 * 60 * 1000;

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
    switch (mode) {
        case "index":
            // 秒杀左右滚动按钮
            let ms_but_left = document.getElementById("miaosha-scroll-left")
            let ms_but_right = document.getElementById("miaosha-scroll-right")
            let ms_list = document.querySelector(".miaosha-scroll ul")

            let num_sc = 200
            ms_but_left.addEventListener("click", (e) => {
                if (ms_list.scrollLeft - num_sc < 0) {
                    ms_list.scrollLeft = 0
                } else {
                    ms_list.scrollLeft = ms_list.scrollLeft - num_sc
                }

            })
            ms_but_right.addEventListener("click", (e) => {
                if (ms_list.scrollLeft + num_sc > ms_list.scrollWidth) {
                    ms_list.scrollLeft = ms_list.scrollWidth
                } else {
                    ms_list.scrollLeft = ms_list.scrollLeft + num_sc
                }
            })
            // 秒杀倒计时
            calc_time()
            // 每秒更新倒计时显示
            let time_stoping = setInterval(function () {
                calc_time()
            }, 1000);

            function update_show_style(show_ul, select_index) {
                for (let i = 0; i < show_ul.children.length; i++) {
                    let sub_node = show_ul.children[i]
                    let selected = sub_node.getAttribute("selected")
                    if (select_index != i) {
                        sub_node.style = null
                    } else if (select_index == i) {
                        sub_node.style.color = "white"
                        sub_node.style.background = "#ec695c"
                        continue
                    }
                }
            }
            // 定义默认选择
            let show_root_select = 0
            // 商品栏
            let show_root = document.getElementsByClassName("show-root")[0]
            let show_ul = show_root.children[0].querySelector("ul")
            for (let i = 0; i < show_ul.children.length; i++) {
                let sub_node = show_ul.children[i]
                let selected = sub_node.getAttribute("selected")
                if (selected != null) {
                    sub_node.style.color = "white"
                    sub_node.style.background = "#ec695c"
                    show_root_select = i
                    update_show_style(show_ul, i)
                }
                // 注册事件
                sub_node.addEventListener("click", (e) => {
                    show_root_select = i
                    update_show_style(show_ul, i)
                })
            }

            
            // 动画列表栏
            let ani_parent = document.getElementById("animation-card-layer")
            for (let i = 0; i < ani_parent.children.length; i++) {
                let node_card = ani_parent.children[i]
                node_card.addEventListener("mouseover", (e) => {
                    node_card.classList.remove("ani-card-default")
                    node_card.classList.add("ani-card-hover")
                    
                    node_card.getElementsByClassName("ani-img")[0].classList.remove("ani-card-img-default")
                    node_card.getElementsByClassName("ani-img")[0].classList.add("ani-card-img-hover")
                })
                node_card.addEventListener("mouseout", (e) => {
                    node_card.classList.remove("ani-card-hover")
                    node_card.classList.add("ani-card-default")

                    node_card.getElementsByClassName("ani-img")[0].classList.add("ani-card-img-default")
                    node_card.getElementsByClassName("ani-img")[0].classList.remove("ani-card-img-hover")
                })
                node_card.classList.add("ani-card-default")
            }
            // 关闭广告按钮
            let x_but = document.getElementsByClassName("div-close-but")
            for (let i = 0; i < x_but.length; i++) {
                x_but[i].addEventListener("click", (e) => {
                    e.srcElement.parentElement.remove()
                })
            }
            // 侧边栏

            let show_b = document.getElementsByClassName("right-bar-ul")[0]// 父
            let show_bar = document.getElementsByClassName("right-bar-ul-sub") //子

            for (let xun = 0; xun < show_b.children.length; xun++) {
                // 确保有子节点，才可执行展开
                if (show_b.children[xun] instanceof HTMLLIElement) {
                    if (show_b.children[xun].children.length > 0) {
                        show_b.children[xun].addEventListener("mouseover", (e) => {
                            if (show_bar[xun].children[0].style.display != "inline-block") {
                                for (let vi = 0; vi < show_bar[xun].children.length; vi++) {
                                    show_bar[xun].children[vi].style.display = "inline-block";
                                }
                            }
                        })

                        show_b.children[xun].addEventListener("mouseout", (e) => {
                            if (show_bar[xun].children[0].style.display != "none") {
                                for (let vi = 0; vi < show_bar[xun].children.length; vi++) {
                                    show_bar[xun].children[vi].style.display = "none";
                                }
                            }
                        })
                    }
                }
            }

            // 顶底部按钮
            let top_but = document.getElementById("topbut")
            let bottom_but = document.getElementById("bottombut")
            let div_body = document.getElementsByClassName("body-content")
            window.addEventListener("scroll", (e) => {
                if (window.scrollY > 0) {
                    top_but.setAttribute("style", "display:inline-block")
                    bottom_but.setAttribute("style", "display:inline-block")
                } else {
                    top_but.setAttribute("style", "display:none")
                    bottom_but.setAttribute("style", "display:none")
                }
            })
            top_but.addEventListener("click", (e) => {
                document.documentElement.scrollTop = 0
            })
            bottom_but.addEventListener("click", (e) => {
                document.documentElement.scrollTop = document.documentElement.scrollHeight
            })
            var left = document.getElementsByClassName("left-view")
            var right = document.getElementsByClassName("right-view")
            var point_view = document.getElementsByClassName("point")

            navObj = document.getElementsByClassName("bar")
            // 动态创建下拉菜单
            StartOption({
                "商品": [
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
            ani.img = ["./lunfan/bj1.jpg", "./lunfan/bj2.jpg", "./lunfan/bj3.jpg"]
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
                    // card_list[i].setAttribute("style", "background:linear-gradient(to bottom,#6495ED,#7B68EE) no-repeat right bottom;")
                    card_list[i].setAttribute("style", "background:#fff;")
                }
            }

            // 开启标题栏下拉菜单
            EnableOption("商品", "")
            break;
        case "login":
            navObj = document.getElementsByClassName("bar")
            // 动态创建下拉菜单
            StartOption({
                "商品": [
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
            // 开启标题栏下拉菜单
            EnableOption("商品", "")

            // 清空按钮
            let input_1 = document.querySelectorAll("input")

            let re_button = document.getElementsByClassName("remove-input")
            re_button[0].addEventListener("click", () => {
                input_1[1].value = ""
                re_button[0].style.visibility = "hidden"
            })
            re_button[1].addEventListener("click", () => {
                input_1[2].value = ""
                re_button[1].style.visibility = "hidden"
            })
            input_1[1].addEventListener("input", (a) => {
                if (input_1[1].value.length != 0) {
                    re_button[0].style.visibility = "visible"
                }
            })
            input_1[2].addEventListener("input", (a) => {
                if (input_1[2].value.length != 0) {
                    re_button[1].style.visibility = "visible"
                }
            })


            // 登录
            let login_button = document.getElementsByClassName("login-b")[0]
            login_button.addEventListener("click", (a) => {
                let m = new RegExp(/[a-zA-Z]+/g)//匹配字母
                switch (true) {
                    case input_1[1].value.length == 0 || input_1[2].value.length == 0:
                        show_error("请输入完整")
                        break;
                    case input_1[1].value.length > 15 || input_1[2].value.length > 15:
                        show_error("用户名或密码长度超出")
                        break;
                    case m.exec(input_1[2].value) == null:
                        show_error("密码没包含字母")
                        break;
                    case input_1[2].value == "admin" && input_1[2].value == "admin":
                        alert("登录成功，欢迎用户admin！")
                        // 跳转
                        // window.open("./index.html")
                        break;
                }

            })
            break;
    }

})
