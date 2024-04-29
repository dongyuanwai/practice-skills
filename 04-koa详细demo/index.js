const Koa = require('koa');
const path = require('path');
const static = require("koa-static");
const router = require('./routes/index')
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const views = require('koa-views');
const session = require('koa-session-minimal');
const JWT = require('./util/JWT.js');


// 应用级组件
app.use(bodyParser());
app.use(static(path.join(__dirname ,'/public')))
// 配置路径和模版引擎  
app.use(views(path.join(__dirname , '/views'),{extension:"ejs"}));

// // 配置session,设置过期时间
// app.use(session({
//     key: 'dyySessionId',
//     cookie:{
//         maxAge: 1000*60*60 // 1小时后过期
//     }
// }))


// // 拦截器
// app.use(async (ctx, next) => {
//     //排除login相关的路由和接口
//     if (ctx.url.includes("login")) {
//         await next()
//         return
//     }

//     if (ctx.session.user) {
//         //重新设置以下sesssion
//         ctx.session.mydate = Date.now()
//         await next()
//     } else {

//         ctx.redirect("/login")
//     }
// })

// // jwt token判断拦截
app.use(async (ctx, next) => {
    //排除login相关的路由和接口
    if (ctx.url.includes("login")) {
        await next()
        return
    }
    const token = ctx.headers['authorization']?.split(' ')[1];
    console.log("token:",token)
    if(token){
        const payload = JWT.verify(token);
        console.log("🚀 ~ app.use ~ payload:", payload)
        if(payload){
            const newToken = JWT.generate({
                id:payload.id,
                username:payload.username
            },'30s')
            ctx.set("Authorization",newToken)
            await next()
        }else{
            ctx.status = 401;
            ctx.body = {
                errCodea:-1,
                errMsg:'token失效'
            }
        }
    }else{
        await next()
    }
})

app.use(router.routes()).use(router.allowedMethods());
app.listen(3456);