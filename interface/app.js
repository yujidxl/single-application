const Koa = require('koa');
const KoaBody = require('koa-body');
const KoaJwt = require('koa-jwt');
const cors = require('koa2-cors');
const router = require('../router');
const app = new Koa();

app.use(
  cors({
    origin: '*',
  })
);
app.use(KoaBody());
app.use(async (ctx, next) => {
  return next().catch((err) => {
    console.log(err);
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = {
        code: -401,
        msg: '接口校验失败',
      };
    } else {
      throw err;
    }
  });
});
app.use(
  KoaJwt({ secret: 'dengxiaolong' }).unless({
    path: [/^\/login\/to/, /^\/login(|\/)$/, /^\/book(|\/)$/],
  })
);
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
