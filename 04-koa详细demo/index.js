const Koa = require('koa');
const static = require("koa-static");
const router = require('./routes/index')
const app = new Koa();
const bodyParser = require('koa-bodyparser');

// 应用级组件
app.use(bodyParser());
app.use(static(__dirname + '/public'));
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);