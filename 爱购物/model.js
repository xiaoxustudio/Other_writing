/*
 * @Author: xuranXYS
 * @LastEditTime: 2023-12-23 16:39:58
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
// 连接数据库
var mysql = require('mysql');
var config = require('./config');
const crypto = require('crypto');
function getDate(date, daysToAdd = 0) {
    if (typeof date === "number") {
        daysToAdd = date
        date = null
    }
    const currentDate = date ? date : new Date()
    if (typeof currentDate === "string") {
        let reg = currentDate.match(/^(\d{4})-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2][0-9]|3[0-1])$/)
        currentDate = [reg[1], reg[2], reg[3]]
    }
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + daysToAdd);
    const year = futureDate.getFullYear();
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
    const day = futureDate.getDate().toString().padStart(2, '0');
    const formattedDateString = `${year}-${month}-${day}`;
    return formattedDateString;
}
// 生成静态key
let static_key = crypto.randomBytes(16)
// 加密函数
function encryptText(text, secretKey, iv = static_key) {
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// 解密函数
function decryptText(encryptedText, secretKey, iv = static_key) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}
module.exports.encryptText = encryptText
module.exports.decryptText = decryptText
module.exports.static_key = static_key
module.exports.getDate = getDate
module.exports.crypto = crypto
module.exports.mysql = mysql
// 创建连接池
var pool = mysql.createPool({
    connectionLimit: 100,
    multipleStatements: true,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
})
//  console.log(pool);
module.exports.pool = pool
let query = module.exports.query = (sql, callback = () => { }) => {
    let res;
    pool.getConnection(function (err, conn) {
        if (err) {
            return callback('连接池连接失败!' + err, null);
        }
        conn.query(sql, function (err, results) {
            conn.release();
            if (err) {
                return callback('查询失败' + err, null);
            }
            res = callback(null, results);
        });
    })
    return res
}
/**
 * @description: phone 和 token 是否有效（过期也算）
 * @param {*} phone
 * @param {*} token
 * @param {*} callback
 * @return {*}
 */
let is_invalid = module.exports.is_invalid = async function (phone, token, callback = () => { }) {
    query("select * from token_list where phone='" + phone + "' and token='" + token + "';", (err, res1) => {
        let res = false
        if (res1 && res1.length > 0) {
            if (getDate() > getDate(res1[0].expire)) {
                // 如果key过期
                res = false
            }
            else { res = true }
        }
        query("select * from user_info where phone='" + phone + "'", (e, v) => {
            callback(err, res, v)
        })
    })
}
module.exports.findProduct = function (callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            return callback('连接池连接失败!' + err, null)
        }
        let sql = `
        SELECT * FROM go_product WHERE p_type='ad-product-computer';
        SELECT * FROM go_product WHERE p_type='ad-product-phone';
        SELECT * FROM go_product WHERE p_type='ad-product-pad';
        SELECT * FROM go_product WHERE p_type='ad-product-ear';
        `;
        conn.query(sql, function (err, results) {
            conn.release();
            if (err) {
                return callback('查询失败' + err, null)
            }
            callback(null, results)
        })
    })
}

/**
 * @description: 查看指定ID的商品
 * @param {*} id
 * @param {*} callback
 * @return {*}
 */
let findID = module.exports.findID = function (id, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            return callback('连接池连接失败!' + err, null)
        }
        let sql = `SELECT * FROM go_product WHERE p_id='${id || null}'`;
        conn.query(sql, function (err, results) {
            conn.release();
            if (err) {
                return callback('查询失败' + err, null)
            }
            callback(null, results)
        })
    })
}

/**
 * @description: 查看购物车指定ID的数量
 * @param {*} id
 * @param {*} callback
 * @return {*}
 */
module.exports.findShopNum = function (phone, token, id, callback = () => { }) {
    is_invalid(phone, token, (e, v) => {
        if (v) {
            pool.getConnection(function (err, conn) {
                if (err) {
                    return callback('连接池连接失败!' + err, null)
                }
                let sql = `SELECT * FROM shopcart WHERE p_id='${id || null}' and phone='${phone || null}'`;
                conn.query(sql, function (err, results) {
                    conn.release();
                    if (err) {
                        return callback('查询失败' + err, null)
                    }
                    callback(null, (results?.[0]?.num) || 0)
                })
            })
        }
    })
}

/**
 * @description: 查看购物车指定用户的所有购物车订单
 * @param {*} phone
 * @param {*} token
 * @param {*} callback
 * @return {*}
 */
let findShopAll = module.exports.findShopAll = function (phone, token, callback = () => { }) {
    is_invalid(phone, token, (e, v) => {
        if (v) {
            pool.getConnection(function (err, conn) {
                if (err) {
                    return callback('连接池连接失败!' + err, null)
                }
                let sql = `SELECT * FROM shopcart WHERE  phone='${phone || null}'`;
                conn.query(sql, function (err, results) {
                    conn.release();
                    if (err) {
                        return callback('查询失败' + err, null)
                    }
                    callback(null, results)
                })
            })
        }
    })
}
let findShop = module.exports.findShop = function (string, callback = () => { }) {
    pool.getConnection(function (err, conn) {
        if (err) {
            return callback('连接池连接失败!' + err, null)
        }
        let sql = `SELECT * FROM go_product WHERE  p_name like '%${string}%';`;
        conn.query(sql, function (err, results) {
            conn.release();
            if (err) {
                return callback('查询失败' + err, null)
            }
            callback(null, results)
        })
    })
}
/**
 * @description: 查找指定电话的数据
 * @param {*} phone
 * @param {*} callback
 * @return {*}
 */
module.exports.findPhone = function (phone, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            return callback('连接池连接失败!' + err, null)
        }
        let sql = "select * from user_info where phone=? ";
        conn.query(sql, [phone], function (err, results) {
            conn.release();
            if (err) {
                return callback('查询失败' + err, null)
            }
            callback(null, results)
        })
    })
}
module.exports.doclearshopcart = function (phone, token, callback) {
    findShopAll(phone, token, (e, res) => {
        if (res.length > 0) {
            let num = 0
            let index = 0
            for (let i of res) {
                findID(i.p_id, (e, r) => {
                    num += parseInt(r[0].p_price1) * parseInt(i.num)
                    if (index === res.length - 1) {
                        // 判断余额是否满足，满足回调返回true并减少余额且清空全部订单，不满足则返回false不进行任何操作
                        is_invalid(phone, token, (e, r, user) => {
                            if (user.length > 0) {
                                if (parseInt(user[0].balance || 0) >= num) {
                                    query(`DELETE FROM shopcart WHERE phone='${phone}'`)
                                    query(`update user_info set balance=${parseInt(user[0].balance || 0) - num}  WHERE phone='${phone}'`)
                                    callback(e, true)
                                } else {
                                    callback(e, false)
                                }

                            }
                        })
                    }
                    index++
                })
            }
        }
    })
}
module.exports.doReg = function (phone, nickname, password, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            return callback('连接池连接失败!' + err, null)
        }
        let sql = "insert into user_info(u_id,phone,nickname,password) values (null,?,?,?)";
        conn.query(sql, [phone, nickname, password], function (err, results) {
            conn.release();
            if (err) {
                return callback('查询失败' + err, null)
            }
            callback(null, results)
        })
    })
}