/*
 * @Author: xuranXYS
 * @LastEditTime: 2023-12-29 14:29:06
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
// 路由
var url = require('url');
var path = require('path');
var fs = require('fs');
var model = require("./model")
var _ = require("underscore")
var formidable = require("formidable");
const { XPreprocessor } = require("./cssprocesser");

module.exports = function (req, res) {
    var urlObj = url.parse(req.url, true)
    var pathname = urlObj.pathname
    var method = req.method.toLowerCase()
    // 展示首页
    if (pathname == '/' && method == 'get') {
        fs.readFile(path.join(__dirname, 'views/index.html'), function (err, data) {
            if (err) {
                return res.end(err.message)
            }
            res.end(data)
            return
        })
        return
    } else if ((pathname.startsWith('/public/') && method == 'get') || (pathname.startsWith('/node_modules/') && method == 'get')) {
        fs.readFile(path.join(__dirname, pathname), function (err, data) {
            if (err) {
                return res.end(err.message)
            }
            // 解析css
            if (pathname.endsWith("css")) {
                let sdata = data.toString()
                if ((/s*(:xr)\s*\n*/.test(sdata))) {
                    sdata = sdata.replace(/s*(:xr)\s*\n*/, "")
                    // 开始处理
                    const beforetime = new Date().getTime()
                    const preprocessor = new XPreprocessor()
                    let _data = preprocessor.process(sdata)
                    const aftertime = new Date().getTime() - beforetime
                    let ss = `/*\n 时间：${new Date().toLocaleDateString()} \n 预编译时间:  ${aftertime} ms  \n*/\n`
                    // 将全部编译的内容添加
                    data = ss + _data
                }
            }
            res.end(data)
        })
    } else if ((pathname.startsWith('/views/') && method == 'get')) {
        fs.readFile(path.join(__dirname, pathname), function (err, data) {
            if (err) {
                return res.end(err.message)
            }
            res.end(data)
        })
    } else if (pathname.startsWith('/login') && method == 'get') {
        fs.readFile(path.join(__dirname, 'views/login.html'), function (err, data) {
            if (err) {
                return res.end(err.message)
            }
            res.end(data)
        })
    } else if (pathname.startsWith('/login') && method == 'post') {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fileds, files) {
            if (err) { return res.end(err.message) }
            var phone = fileds.phone
            var password = fileds.password
            model.findPhone(phone, function (err, results) {
                // 接受到以数组-(数组(不同的查询结果)>对象形式)的数据类型序列 
                let obj = { status: 0 }
                if (err) { obj.msg = err; return res.end(JSON.stringify(obj)) }
                if (results.length == 0) {
                    obj.msg = "电话号码未注册"
                    obj.target = "/login"
                    res.end(JSON.stringify(obj));
                } else {
                    if (results[0].password != password) {
                        obj.msg = "密码不正确，请重新输入！"
                        obj.target = "/login"
                        res.end(JSON.stringify(obj));
                    } else {
                        let d_key = model.crypto.randomBytes(32) // 创建动态key
                        model.query("select * from token_list where phone ='" + fileds.phone + "';", (err, keys) => {
                            let token;
                            if (keys.length > 0) {
                                // 使用已存在的key
                                token = keys[0].token
                                if (model.getDate() > model.getDate(keys[0].expire)) {
                                    // 如果key过期则延长key的有效期
                                    let sql = `update token_list set expire='${model.getDate(1)}' where phone='${keys[0].phone}' and id='${keys[0].id}'`
                                    model.query(sql)
                                }
                            } else {
                                // 创建新的token
                                token = model.encryptText(JSON.stringify(fileds), d_key)
                                let str_concat = `('${fileds.phone}','${token}','${d_key.toString("hex")}','${model.static_key.toString("hex")}','${model.getDate(1)}');`
                                let sql = `insert into token_list(phone,token,\`key\`,s_key,expire) values ${str_concat}`
                                model.query(sql)
                            }
                            obj.status = 1
                            obj.msg = "登录成功！"
                            obj.target = "/"
                            obj.token = token
                            obj.phone = phone[0]
                            res.end(JSON.stringify(obj));
                            return
                        })
                    }
                }
            })
        })
    } else if (pathname.startsWith('/register') && method == 'get') {
        fs.readFile(path.join(__dirname, 'views/register.html'), function (err, data) {
            if (err) {
                return res.end(err.message)
            }
            res.end(data)
        })
    } else if (pathname.startsWith('/register') && method == 'post') {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fileds, files) {
            if (err) { return res.end(err.message) }
            var phone = fileds.phone || 0
            var password = fileds.password || 0
            var nickname = fileds.nickname || 0
            // 检测电话唯一
            model.findPhone(phone, function (err, results) {
                // 接受到以数组-(数组(不同的查询结果)>对象形式)的数据类型序列 
                let obj = { status: 0 }
                if (err) { console.error(err); obj.msg = err; return res.end(JSON.stringify(obj)) }
                if (results.length == 0) {
                    // 提交
                    model.doReg(phone, nickname, password, function (err, results2) {
                        if (err) { console.error(err); obj.msg = err; return res.end(JSON.stringify(obj)) }
                        obj.status = 1
                        obj.msg = "注册成功，前去登录！"
                        obj.target = "/login"
                        res.end(JSON.stringify(obj));
                    })
                    return
                }
                obj.msg = "此电话号码已经注册了，请重新输入！"
                obj.target = "/register"
                res.end(JSON.stringify(obj));
                // endPhone
            })
            // endParse
        })
    } else if (pathname === "/detail" && method === "post") {
        // 商品详情
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fileds, files) {
            let id = parseInt(fileds.id?.[0].match(/([0-9]+)/g)[0] || fileds.id.match(/([0-9]+)/g)[0] || "0")
            let obj = { status: 0, id }
            model.query("select * from go_product where p_id='" + id + "'", (e, r) => {
                if (r.length > 0) {
                    obj.status = 1
                    obj.data = r[0]
                }
                res.end(JSON.stringify(obj))
            })
        })
    } else if (pathname === "/addshopcart" && method === "post") {
        // 加入购物车
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fileds, files) {
            let id = parseInt(fileds?.id?.[0].match(/([0-9]+)/g)[0] || "0")
            let num = parseInt(fileds?.num?.[0].match(/([0-9]+)/g)[0] || "1")
            let token = fileds.token[0]
            let phone = fileds.phone[0]
            let obj = { status: 0, id, num }
            // 判断token是否有效
            model.is_invalid(phone, token, (err, ress) => {
                if (ress) {
                    model.findID(id, (err, result123) => {
                        if (!result123 || result123.length <= 0) {
                            obj.msg = "商品ID：" + id + " 加入购物车失败"
                            res.end(JSON.stringify(obj))
                            return
                        }
                        // 判断是否有对应id，有就直接修改数量，没有则添加数量
                        model.query("select * from shopcart where phone='" + phone + "' and p_id='" + id + "'", (e, r) => {
                            if (r && r.length > 0) {
                                // 添加新的记录
                                model.query(`update shopcart set num = ${r[0].num + num} where phone='` + phone + "' and p_id='" + id + "'")
                            } else {
                                model.query(`insert into shopcart(id,phone,p_id,num) values (null,${phone},${id},${num})`)
                            }
                            obj.status = 1
                            obj.msg = "商品ID：" + id + " 加入购物车成功"
                            res.end(JSON.stringify(obj))
                            return
                        })
                    })
                } else {
                    obj.msg = "登录信息无效，请重新登录"
                    res.end(JSON.stringify(obj))
                    return
                }
            })
        })
    } else if (pathname === "/shoplist" && method === "get") {
        fs.readFile(path.join(__dirname, 'views/shoplist.html'), function (err, data) {
            if (err) {
                return res.end(err.message)
            }
            res.end(data)
            return
        })
        // model.is_invalid(phone, token, (err, to_res) => { console.log(to_res) })
    } else if (pathname === "/shoplist" && method === "post") {
        let obj = { status: 0 }
        model.findProduct(function (err, results) {
            if (err) { console.error(err); return }
            obj.data = results
            obj.all = [...results[0], ...results[1], ...results[2], ...results[3]]
            obj.status = 1
            res.end(JSON.stringify(obj));
        })
        return
    } else if (pathname === "/shopcartnum" && method === "post") {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fileds, files) {
            let phone = fileds?.phone?.[0] || -1
            let token = fileds?.token?.[0] || -1
            let id = fileds?.id?.[0] || -1
            let obj = { status: 0 }
            model.findShopNum(phone, token, id, (err, result) => {
                try {
                    let num = parseInt(result)
                    obj.status = 1
                    obj.num = num
                    res.end(JSON.stringify(obj));
                    return
                } catch (e) {
                    obj.status = 0
                    obj.num = -1
                    res.end(JSON.stringify(obj));
                    return
                }
            })
            return
        })
        return
    } else if (pathname === "/shopcartall" && method === "get") {
        fs.readFile(path.join(__dirname, 'views/usershoplist.html'), function (err, data) {
            if (err) {
                return res.end(err.message)
            }
            res.end(data)
            return
        })
        // 
    } else if (pathname === "/shopcartall" && method === "post") {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fileds, files) {
            let phone = fileds?.phone?.[0] || -1
            let token = fileds?.token?.[0] || -1
            let obj = { status: 0 }
            model.findShopAll(phone, token, (err, result) => {
                if (result instanceof Array) {
                    obj.status = 1
                    obj.data = result
                    res.end(JSON.stringify(obj));
                    return
                } else {
                    obj.status = 0
                    res.end(JSON.stringify(obj));
                    return
                }
            })
        })
    } else if (pathname === "/searchshop" && method === "post") {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fileds, files) {
            let string = String(fileds?.s_word?.[0] || "").match(/([\u4e00-\u9fa5a-zA-Z0-9]+)/) || ""
            let obj = { status: 0 }
            model.findShop(string[1], (err, result) => {
                if (result instanceof Array) {
                    obj.status = 1
                    obj.data = result
                    res.end(JSON.stringify(obj));
                    return
                } else {
                    obj.status = 0
                    res.end(JSON.stringify(obj));
                    return
                }
            })
        })
    } else if (pathname === "/userdetail" && method === "post") {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fileds, files) {
            let phone = fileds?.phone || -1
            let token = fileds?.token || -1
            model.is_invalid(phone, token, (err, to_res, allres) => {
                let obj = { status: 0 }
                if (to_res) {
                    obj.status = 1
                    obj.data = allres
                    res.end(JSON.stringify(obj))
                    return
                } else {
                    res.end(JSON.stringify(obj))
                    return
                }
            })
        })
    } else if (pathname === "/dopay" && method === "post") {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fileds, files) {
            let phone = fileds?.phone || -1
            let token = fileds?.token || -1
            model.is_invalid(phone, token, (err, to_res) => {
                let obj = { status: 0 }
                if (to_res) {
                    model.doclearshopcart(phone, token, (err, res123) => {
                        if (res123) {
                            obj.status = 1
                            res.end(JSON.stringify(obj))
                            return
                        } else {
                            res.end(JSON.stringify(obj))
                            return
                        }
                    })
                } else {
                    res.end(JSON.stringify(obj))
                    return
                }
            })
        })
    } else if (pathname === "/userdetail" && method === "get") {
        fs.readFile(path.join(__dirname, "views/userinfo.html"), function (err, data) {
            if (err) {
                return res.end(err.message)
            }
            res.end(data)
            return
        })
    } else if (pathname === "/changeuser" && method === "post") {
        var form = new formidable.IncomingForm()
        form.parse(req, function (err, fileds, files) {
            let phone = fileds?.phone?.[0] || -1
            let token = fileds?.token?.[0] || -1
            let nickname = fileds?.nickname?.[0] || -1
            let balance = fileds?.balance?.[0] || -1
            let password = fileds?.password?.[0] || -1
            let u_id = fileds?.u_id?.[0] || -1
            model.is_invalid(phone, token, (err, to_res) => {
                let obj = { status: 0 }
                if (to_res) {
                    // 验证
                    let check = {
                        password: /^[0-9a-zA-Z]{2,10}$/g,
                        phone: /^1[3456789]\d{9}$/,
                        nickname: /^[\u4e00-\u9fa5A-Za-z0-9]+$/,
                        balance: /^[0-9]+$/,
                        u_id: /^[0-9]+$/,
                    }
                    if (check["password"].test(password) && check["phone"].test(phone)
                        && check["nickname"].test(nickname) && check["balance"].test(balance) && check["u_id"].test(u_id)
                    ) {
                        // 通过
                        let sql = `
                        update user_info set nickname='${nickname}' ,
                        balance='${balance}' ,password='${password}' where u_id='${u_id}' and phone='${phone}';
                        `
                        model.query(sql, (e, v) => {
                            if (e) {
                                res.end(JSON.stringify(obj))
                                return
                            }
                            obj.status = 1
                            res.end(JSON.stringify(obj))
                            return
                        })
                        return
                    } else {
                        res.end(JSON.stringify(obj))
                        return
                    }
                    return
                } else {
                    res.end(JSON.stringify(obj))
                    return
                }
            })
        })
    } else {
        fs.readFile(path.join(__dirname, pathname), function (err, data) {
            if (err) {
                console.warn("此资源文件未知（可能不存在）：", pathname, method)
                return res.end(err.message)
            }
            // 解析css
            if (pathname.endsWith("css")) {
                let sdata = data.toString()
                if ((/s*(:xr)\s*\n*/.test(sdata))) {
                    sdata = sdata.replace(/s*(:xr)\s*\n*/, "")
                    // 开始处理
                    const beforetime = new Date().getTime()
                    const preprocessor = new XPreprocessor()
                    let _data = preprocessor.process(sdata)
                    const aftertime = new Date().getTime() - beforetime
                    let ss = `/*\n 时间：${new Date().toLocaleDateString()} \n 预编译时间:  ${aftertime} ms  \n*/\n`
                    // 将全部编译的内容添加
                    data = ss + _data
                }
            }
            if (data?.byteLength > 0) {
                console.warn("此资源文件不确定：", pathname, method)
            }
            res.end(data)
        })
    }
}

