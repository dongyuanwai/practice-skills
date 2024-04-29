const Router = require("koa-router")
const router = new Router();
  
  router.get("/",async (ctx,next)=>{
    // 读取cookie
    // console.log("cookie",ctx.cookies.get("username"))

    
    // render 会自动找 views 文件夹下的 home.ejs
    await ctx.render("home",{
      title:"home的页面",
      username:"董员外"})
  })
  router.get("/list",async (ctx,next)=>{
    await ctx.render("home",{
      data:"恭喜登录成功"
    })
  })

module.exports = router