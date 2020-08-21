const request = require('superagent');
require('superagent-charset')(request);
const BookList = require('../model/book_list');
const Cheerio = require('cheerio');
const { book_list_config } = require('./classList.config');
const getChapterList = require('./fetch_chapter_list');

(async () => {
  try {
    let { baseUrl, getNums } = book_list_config;
    const max = getNums;
    while(getNums>0) {
      getNums--;
      const res = await request.get(`${baseUrl}${max-getNums}.html`)
        .charset('gbk')
        .buffer(true);
      const books = [];
      const $ = Cheerio.load(res.text || '');
      const $books = $('.book-coverlist>.row');
      $books.each(async (index, item) => {
        if (index > 1) return;
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
        await getChapterList(chapter_id);
        books.push({
          book_name,
          book_author,
          book_img,
          book_description,
          chapter_id,
        });
      });
      await BookList.bulkCreate(books);
      console.log('书籍列表同步成功');
    }
    
  } catch (err) {
    console.log(err);
  }
})();