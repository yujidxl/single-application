const request = require('superagent');
require('superagent-charset')(request);
const ChapterList = require('../model/chapter_list');
const Cheerio = require('cheerio');
const { chapter_list_config } = require('./classList.config');
const getChapterDetail = require('./fetch_chapter_detail');

const getChapterList = async function(chapter_id) {
  try {
    const { baseUrl } = chapter_list_config;
    const res = await request.get(`${baseUrl}${chapter_id}/`)
      .charset('gbk')
      .buffer(true);
    const $ = Cheerio.load(res.text || '');
    const chapter_list = [];
    const chapters = $('#list-chapterAll .panel-chapterlist dd>a');
    chapters.each(async (index, chapter) => {
      if (index > 100) return;
      let chapter_name = $(chapter).text();
      if (chapter_name.indexOf('.')>-1) {
        chapter_name = chapter_name.split('.')[1];
      }
      const chapter_detail_id = $(chapter).attr('href').slice(0, -5)
      await getChapterDetail(chapter_id, chapter_detail_id);
      chapter_list.push(
        {
          chapter_id,
          chapter_name,
          chapter_detail_id,
        }
      )
    })
    // console.log(chapter_list);
    await ChapterList.bulkCreate(chapter_list);
  } catch(err) {
    console.log('获取章节出错：' + err.toString());
  }
}

module.exports = getChapterList;