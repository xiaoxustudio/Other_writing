/*
 * @Author: xuranXYS
 * @LastEditTime: 2023-12-08 08:06:30
 * @GitHub: www.github.com/xiaoxustudio
 * @WebSite: www.xiaoxustudio.top
 * @Description: By xuranXYS
 */
// 服务器：项目入口文件
var http = require('http');
var config = require('./config');
var router = require('./router');
var server = http.createServer();
server.on('request', function (req, res) {
    router(req, res);
})
server.listen(config, config.port, config.host, function () {
    console.log('server is running at http://' + config.host + ':' + config.port);
})