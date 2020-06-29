const Koax = require('koa2-request-middleware');
const Koa = require('koa');
const Iconv = require('iconv-lite');
const Cheerio = require('cheerio');
let koax = new Koax();
let app = new Koa();
koax.mount(async()=>{
	return koax.setName('testKoax1').cached().request({
    uri:'https://www.qidian.com/index.html',
    // uri: 'http://m.xbiquge.la/index.php',
    method:'GET',
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1/isHexin/1/userid/467747417  isChrome/1"
    }
	})
});

app.use(koax.middleware());
app.use(async (ctx,next) => {
  const $ = Cheerio.load(Iconv.encode(ctx.koax.testKoax1, 'UTF-8'));
  ctx.set('Content-Type', 'text/html; charset=UTF-8');
  ctx.body = $('a[data-eid=qd_A40]>img').attr('src');
});
app.listen(8000);