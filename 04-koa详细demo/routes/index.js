const Router = require("koa-router")
const JWT = require("../util/JWT.JS")
const router = new Router();
const listRouter = require('./list');
const userRouter = require('./user');
const homeRouter = require('./home');
const loginRouter = require("./login")
// 前缀
// router.prefix('/api');
// 注册路由级组件
router.use("/list", listRouter.routes(), listRouter.allowedMethods());
router.use("/user", userRouter.routes(), userRouter.allowedMethods());

router.use("/home",homeRouter.routes(), homeRouter.allowedMethods());
router.use("/login",loginRouter.routes(), loginRouter.allowedMethods());
// 重定向
router.redirect('/', '/home');

// // jwt验证
// const token  = JWT.generate({name:'dongyuanwai'},'10s')
// console.log("立即验证",JWT.verify(token))

// setTimeout(()=>{
//     console.log("9s后验证",JWT.verify(token))
// },9000)

// setTimeout(()=>{
//     console.log("12s后验证",JWT.verify(token))
// },12000)


module.exports = router;