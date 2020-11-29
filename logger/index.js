/**
 * 爬虫日志配置函数
 */
const path = require('path');
const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { type: 'console' },
    spider: {
      type: 'dateFile',
      filename: path.join(__dirname, '../logs/spider.log'),
      pattern: '.yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    }
  },
  categories: {
    default: { appenders: ['console'], level: 'DEBUG' },
    spider: { appenders: ['spider', 'console'], level: 'DEBUG' }
  }
})

const log = log4js.getLogger('spider')

module.exports = log;
