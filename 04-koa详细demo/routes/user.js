const Router = require("koa-router")
const router = new Router();


router.post("/",(ctx,next)=>{
    // console.log("post参数",ctx.request.body)
    // ctx.cookies.set("token",'this is a token')
    // console.log("ctx.cookies",ctx.cookies.get("token"))

    ctx.session.user = {
      username:"dong"
    }

    ctx.body={
      ok:1,
      info:'add success',
    }
  })
  
  router.get("/",(ctx,next)=>{
    console.log(ctx.query)
    ctx.body=['111','222']
  })
  
  router.put("/:id",(ctx,next)=>{
    ctx.body={
      ok:1,
      info:'update success',
    }
  })
  router.del("/:id",(ctx,next)=>{
    ctx.body={
      ok:1,
      info:'del success',
    }
  })

  module.exports = router