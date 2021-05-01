const bookFn = function (router) {
  router.get('/', (ctx, next) => {
    ctx.body = 'Hi, new application';
  });
};

module.exports = bookFn;
