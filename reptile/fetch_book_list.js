const request = require('superagent');
require('superagent-charset')(request);
const BookList = require('../model/book_list');
const Cheerio = require('cheerio');
const { book_list_config } = require('./classList.config');

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
      $books.each((index, item) => {
        const book_img = $(item).children('.col-md-5').find('.thumbnail').attr('src');
        const book_name = $(item).children('.col-md-7').find('.caption>h4>a').text();
        const book_author = $(item).children('.col-md-7').find('small.text-muted').text();
        const book_description = $(item).children('.col-md-7')
          .find('p.text-muted')
          .text().replace(/[\n\t\s]/g, '');
        books.push({
          book_name,
          book_author,
          book_img,
          book_description
        });
      });
      console.log(books);
      await BookList.bulkCreate(books);
    }
    
  } catch (err) {
    console.log(err);
  }
})();