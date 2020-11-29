const UserAgent = require('user-agents');
const log = require('../logger');

const useragent = new UserAgent({
  deviceCategory: 'mobile'
}).random();

module.exports = useragent.toString();