const request = require('superagent');
const delay = require('delay');
const Queue = require('p-queue');
require('superagent-charset')(request);
const BookList = require('../model/book_list');
const Cheerio = require('cheerio');
const { book_list_config } = require('./classList.config');
const getChapterList = require('./fetch_chapter_list');
const log = require('../logger');
const useragent = require('../userAgent');

(async () => {
  try {
    let { baseUrl, getNums } = book_list_config;
    const max = getNums;
    const books = [];
    while(getNums>0) {
      getNums--;
      const res = await request.get(`${baseUrl}${max-getNums}.html`)
        .set('User-Agent', useragent)
        .charset('gbk')
        .buffer(true);
      const $ = Cheerio.load(res.text || '');
      const $books = $('.book-coverlist>.row');
      $books.each(async (index, item) => {
        const book_img = $(item).children('.col-md-5').find('.thumbnail').attr('src');
        const book_name = $(item).children('.col-md-7').find('.caption>h4>a').text();
        const book_author = $(item).children('.col-md-7').find('small.text-muted').text();
        const book_description = $(item).children('.col-md-7')
          .find('p.text-muted')
          .text().replace(/[\n\t\s]/g, '');
        const chapter_id_arr = $(item)
          .children('.col-md-7')
          .find('.caption>h4>a')
          .attr('href')
          .split('/');
        const chapter_id = chapter_id_arr[chapter_id_arr.length-2];
        books.push({
          book_name,
          book_author,
          book_img,
          book_description,
          chapter_id,
        });
      });
    }
    await BookList.destroy({truncate: true});
    await BookList.bulkCreate(books);
    await getChapterList(books);
    log.debug('书籍数据已全部入库'); 
  } catch (err) {
    log.error(`书籍入库失败：${err}`);
  }
})();