const request = require('superagent');
require('superagent-charset')(request);
const ChapterDetail = require('../model/chapter_detail');
const Cheerio = require('cheerio');
const { chapter_list_config } = require('./classList.config');

const getChapterDetail = async function(chapter_id, chapter_detail_id, suffix='', chapter_detail = '') {
  try {
    const { baseUrl } = chapter_list_config;
    console.log(`${baseUrl}${chapter_id}/${chapter_detail_id}${suffix}.html`);
    const res = await request.get(`${baseUrl}${chapter_id}/${chapter_detail_id}${suffix}.html`)
      .charset('gbk')
      .buffer(true);
    const $ = Cheerio.load(res.text || '');
    let chapter_page_nums = $('.readTitle').children('small').text();
    const chapter_name = $('.active').text();
    chapter_detail += $('#htmlContent').html().replace(/(.+<br><br>)|(--&gt;&gt;.+)/g, '');
    console.log(chapter_page_nums.match(/[1-9]/g));
    const chapter_page_arr = chapter_page_nums.match(/[1-9]/g);
    if (Object.prototype.toString.call(chapter_page_arr).slice(8, -1) === 'Array' &&
      chapter_page_arr.length === 2 && chapter_page_arr[0] !== chapter_page_arr[1]) {
      await getChapterDetail(chapter_id, chapter_detail_id, `_${+chapter_page_arr[0]+1}`, chapter_detail);
    } else {
      chapter_obj = {
        chapter_detail_id,
        chapter_name,
        chapter_detail
      }
      await ChapterDetail.create(chapter_obj);
    }
  } catch(err) {
    console.log('获取章节详情 出错：' + err);
  }
}

module.exports = getChapterDetail;