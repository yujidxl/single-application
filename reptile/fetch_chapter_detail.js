const request = require('superagent');
const delay = require('delay');
const { default: Queue } = require('p-queue');
require('superagent-charset')(request);
require('superagent-proxy')(request);
const ChapterList = require('../model/chapter_list');
const ChapterDetail = require('../model/chapter_detail');
const Cheerio = require('cheerio');
const { chapter_list_config } = require('./classList.config');
const useragent = require('../userAgent');
const log = require('../logger');

const getChapterDetail = async function () {
  // await ChapterDetail.destroy({truncate: true});
  const chapter_list = await ChapterList.findAll({ raw: true, where: {chapter_ready_pass: false}, attributes: { exclude: ['created_at', 'updated_at'] }});
  // log.debug(chapter_list);
  const sub_queue = new Queue({ concurrency: 1, autoStart: false});
  const { baseUrl } = chapter_list_config;
  for(let i=0; i< chapter_list.length; i++) {
    sub_queue.add(async ()=> {
      const chapter = chapter_list[i];
      try {
        const res = await request.get(`${baseUrl}${chapter.chapter_id}/${chapter.chapter_detail_id}.html`)
        .set('User-Agent', useragent)
        .charset('gbk')
        .buffer(true)
        .timeout({ response: 10000, deadline: 10000 })
        // .proxy('http://101.69.172.32');
        const $ = Cheerio.load(res.text || '');
        const chapter_name = $('.active').text();
        const chapter_detail = $('#htmlContent').html().replace(/(.+<br><br>)|(--&gt;&gt;.+)/g, '');
        chapter_obj = {
          chapter_detail,
          chapter_detail_id: chapter.chapter_detail_id,
          chapter_name,
        }
        await ChapterDetail.create(chapter_obj);
        await ChapterList.update({chapter_ready_pass: true}, {where: {
          id: chapter.id
        }});
        log.debug(`已入库章节：${chapter_name}----${chapter.chapter_id}`)
      } catch(err) {
        log.debug('获取当前章节失败' + chapter.chapter_id);
        log.error(err);
        process.exit(0);
      }
    });
  }
  sub_queue.start();
  await sub_queue.onIdle();
  log.debug('章节详情数据已全部入库');
}
!(async () => {
  await getChapterDetail();
})();
  // const func = async (chapter_id, chapter_detail_id,suffix='', chapter_detail = '') => {
  //     await delay(100);
  //     log.debug(`${baseUrl}${chapter_id}/${chapter_detail_id}${suffix}.html`);
  //       let chapter_page_nums = $('.readTitle').children('small').text();
  //       log.info(chapter_page_nums.match(/[1-9]/g));
  //       const chapter_page_arr = chapter_page_nums.match(/[1-9]/g);
  //       if (Object.prototype.toString.call(chapter_page_arr).slice(8, -1) === 'Array' &&
  //         chapter_page_arr.length === 2 && chapter_page_arr[0] !== chapter_page_arr[1]) {
  //         log.debug('加载第二章: ' + `_${+chapter_page_arr[0]+1}`);
  //         func(chapter_id, chapter_detail_id, `_${+chapter_page_arr[0]+1}`, chapter_detail);
  //       } else {
  //       }
  // }

// module.exports = getChapterDetail;