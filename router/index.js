const Router = require('@koa/router');
const loginFn = require('./login');
const bookFn = require('./book');

const router = new Router();

// 登录相关
router.prefix('/login');
loginFn(router);

// 书籍相关
router.prefix('/book');
bookFn(router);

module.exports = router;
