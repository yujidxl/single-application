const request = require('superagent');
const BookList = require('../model/book_list');
const Cheerio = require('cheerio');

(async () => {
  try {
    const res = await request.get('https://www.qidian.com/rank/yuepiao?chn=21');
    const books = [];
    const $ = Cheerio.load(res.text || '');
    const $books = $('.rank-body ul>li .book-mid-info');
    $books.each((index, item) => {
      const book_name = $(item).children('h4').children('a').text();
      const book_author = $(item).children('.author').children('a.name').text();
      const book_description = $(item).children('.intro').text().replace(/[\n\t\s]/g, '');
      books.push({
        book_name,
        book_author,
        book_description
      });
    });
    await BookList.bulkCreate(books);
    console.log('数据库书籍列表更新完毕！')
  } catch (err) {
    console.log(err);
  }
})();