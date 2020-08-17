const sequelize  = require('../mysql/init');
const { DataTypes } = require('sequelize');

!async function() {
  await sequelize.sync({ force: true });
  console.log("所有模型均已成功同步.");
}();

module.exports = sequelize.define('BookList', {
  book_id: {
    type: DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true
  },
  book_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  book_author: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  book_description: {
    type: DataTypes.STRING(300),
    allowNull: false,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  // 想要 updatedAt 但是希望名称叫做 updated_at
  updatedAt: 'updated_at'
});