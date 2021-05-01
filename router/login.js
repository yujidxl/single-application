const User = require('../model/user');
const jwt = require('jsonwebtoken');
const loginFn = function (router) {
  /** 
   code -1 信息验证错误
   -2 库中存在当前用户
   0  通过注册成功
   */
  // 创建用户
  router.post('/', async (ctx, next) => {
    const { email, password } = ctx.request.body;
    if (!/.+@.+/.test(email)) {
      ctx.body = {
        code: -1,
        msg: '邮箱格式错误！',
      };
      return;
    }
    if (!/\w+/.test(password)) {
      ctx.body = {
        code: -1,
        msg: '密码格式错误！',
      };
      return;
    }
    const one = await User.findOne({ where: { email } });
    if (!one) {
      const data = await User.create({
        email,
        password,
      });
      ctx.body = {
        code: 0,
        data,
        msg: '创建成功～',
      };
    } else {
      ctx.body = {
        code: -2,
        data: {
          email,
          password,
        },
        msg: '当前用于已经存在，请更换用户名再次尝试～',
      };
    }
  });

  // 获取所有用户列表
  router.get('/list', async (ctx, next) => {
    const data = await User.findAll({ order: [['created_at', 'DESC']] });
    ctx.body = {
      code: 0,
      data,
      msg: 'success',
    };
  });

  // 更新用户信息
  router.patch('/:id', async (ctx, next) => {
    const { password, email } = ctx.request.body;
    const id = ctx.params.id;
    const data = await User.update(
      { email, password },
      {
        where: { id },
      }
    );
    if (data) {
      ctx.body = {
        code: 0,
        data,
        msg: '更新成功～',
      };
      return;
    }
    ctx.body = {
      code: -1,
      data: data,
      msg: '更新失败～',
    };
  });

  // 登录接口
  router.post('/to', async (ctx, next) => {
    const { email, password } = ctx.request.body;
    console.log(
      `已调用登录接口，调用方为:\n 用户名： ${email} \n 密码：${password}`
    );
    const finded = await User.findOne({ where: { email } });
    if (!finded) {
      ctx.body = {
        code: -1,
        msg: '当前用户不存在，请核实后尝试重新登录',
      };
      return;
    }
    const { password: findedPassword } = finded;
    if (findedPassword !== password) {
      ctx.body = {
        code: -1,
        msg: '密码输入有误，请核实后重新输入～',
      };
      return;
    }
    const token = jwt.sign({ email, password }, 'dengxiaolong', {
      expiresIn: '1h',
    });
    ctx.body = {
      code: 0,
      token,
      msg: '登录成功～',
    };
  });
};

module.exports = loginFn;
