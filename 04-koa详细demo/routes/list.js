const Router = require("koa-router")
const router = new Router();
const connection = require('../db/index')
router.post("/", async (ctx, next) => {
  const newData = ['js事件循环', 'vue生命周期', 'jwt鉴权'];
  let sql = `INSERT INTO list (title) VALUES`;
  const values = newData.map(data => {
    return `(${connection.escape(data)})`;
  });
  sql += values.join(", ");
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    ctx.body = {
      ok: 1,
      info: newData,
    }
  } catch (err) {
    console.log("🚀 ~ router.post ~ err:", err)
    ctx.body = { error: 'Internal Server Error666' };
  }
})

router.get("/", async (ctx, next) => {
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM list', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    ctx.body = results;
  } catch (err) {
    ctx.body = { error: 'Internal Server Error666' };
  }
  // ctx.body="loading"
})


router.put("/:id", async (ctx, next) => {
  let sql = "UPDATE list SET title=? WHERE id = ?"
  let sqlParams = '这是新的问题'
  console.log("🚀 ~ router.put ~ ctx.body:", ctx.params.id)
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sql, [sqlParams,ctx.params.id],(err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    ctx.body = {
      ok: 1,
      info: 'update success',
    }
  } catch (err) {
    console.log("🚀 ~ router.post ~ err:", err)
    ctx.body = { error: 'Internal Server Error666' };
  }
})

router.del("/:id", async (ctx, next) => {
  let sql = `DELETE FROM list WHERE id > ${ctx.params.id}`
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("错误", err)
    } else {
      console.log("删除结果：", results)
    }
  });
  ctx.body = {
    ok: 1,
    info: 'del success',
  }
})

module.exports = router