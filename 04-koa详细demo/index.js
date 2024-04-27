const Koa = require('koa');
const path = require('path');
const static = require("koa-static");
const router = require('./routes/index')
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');

// 应用级组件
app.use(bodyParser());
app.use(static(path.join(__dirname ,'/public')))
// 配置路径和模版引擎  
app.use(views(path.join(__dirname , '/views'),{extension:"ejs"}));
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);