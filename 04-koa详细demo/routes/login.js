const Router = require("koa-router")
const JWT = require("../util/JWT.js")
const router = new Router();
  
  router.get("/",async (ctx,next)=>{
    // render 会自动找 views 文件夹下的 login.ejs
    await ctx.render("login",{
      title:"login的页面",
    })
  })
  router.post("/",async (ctx,next)=>{
    // render 会自动找 views 文件夹下的 login.ejs
    const postData = ctx.request.body;
    const {username,password} = ctx.request.body
    if(username==="dongyuanwai"&&password==="123456"){
      // 设置header
      const token = JWT.generate({
        username,
        id:1111,
      },"30s")
      ctx.set("Authorization",token)
      
      ctx.body={
        ok:1,
        info:'login success',
      }
    }else{
      ctx.body={
        ok:0,
        info:'login fail',
      }
    }
  })

module.exports = router