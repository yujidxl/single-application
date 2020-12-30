const { Sequelize }  = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize('Book', 'root', 'root', {
  host: config.mysqlHost,
  port: 3306,
  dialect: 'mysql',
  define: {
    freezeTableName: true
  },
  logging: false,
});
module.exports = sequelize;