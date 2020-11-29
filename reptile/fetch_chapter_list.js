const request = require('superagent');
require('superagent-charset')(request);
const ChapterList = require('../model/chapter_list');
const Cheerio = require('cheerio');
const delay = require('delay');
const { default: Queue } = require('p-queue');
const { chapter_list_config } = require('./classList.config');
// const getChapterDetail = require('./fetch_chapter_detail');
const useragent = require('../userAgent');
const log = require('../logger');

const getChapterList = async function(books) {
  try {
    const { baseUrl } = chapter_list_config;
    const chapter_list = [];
    const queue = new Queue({concurrency: 1, autoStart: false});
    books.forEach((book) => {
      queue.add(async () => {
        const res = await request.get(`${baseUrl}${book.chapter_id}/`)
          .set('User-Agent', useragent)
          .charset('gbk')
          .buffer(true);
        const $ = Cheerio.load(res.text || '');
        const chapters = $('#list-chapterAll .panel-chapterlist dd>a');
        chapters.each((index, chapter) => {
          let chapter_name = $(chapter).text();
          if (chapter_name.indexOf('.')>-1) {
            chapter_name = chapter_name.split('.')[1];
          }
          const chapter_detail_id = $(chapter).attr('href').slice(0, -5)
          chapter_list.push(
            {
              chapter_id: book.chapter_id,
              chapter_name,
              chapter_detail_id,
            }
          )
        })
      })
    });
    queue.start();
    await queue.onIdle();
    await ChapterList.destroy({truncate: true});
    await ChapterList.bulkCreate(chapter_list); 
    log.debug('章节数据已全部入库');
    // await getChapterDetail(chapter_list);
  } catch(err) {
    log.error(`章节数据入库失败${err}`);
  }
}

module.exports = getChapterList;