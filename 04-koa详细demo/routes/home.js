const Router = require("koa-router")
const router = new Router();
  
  router.get("/",async (ctx,next)=>{
    // render 会自动找 views 文件夹下的 home.ejs
    await ctx.render("home",{
      title:"home的页面",
      username:"董员外"})
  })
  

module.exports = router