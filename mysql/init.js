const { Sequelize }  = require('sequelize');

const sequelize = new Sequelize('Book', 'root', 'root', {
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql',
  define: {
    freezeTableName: true
  },
  logging: false,
});
module.exports = sequelize;