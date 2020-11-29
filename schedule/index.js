const path = require('path');
const schedule = require('node-schedule');
const log = require('../logger');
const exec = require('exec-sh');

// const rule = new schedule.RecurrenceRule();
// rule.second = [0, 10, 20, 30, 40 ,50];
const job = schedule.scheduleJob('0 * * * * *', function() {
  log.debug(+new Date());
  exec(`node ${path.join(process.cwd(), './reptile/fetch_book_list.js')}`)
})