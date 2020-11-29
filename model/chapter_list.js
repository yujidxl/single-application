const sequelize  = require('../mysql/init');
const { DataTypes } = require('sequelize');

// !async function() {
//   await sequelize.sync({ force: true });
//   // await sequelize.sync();
//   console.log("所有章节列表模型均已同步.");
// }();

module.exports = sequelize.define('ChapterList', {
  chapter_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  chapter_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  chapter_detail_id: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  chapter_ready_pass: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  }
},{
  timestamps: true,
  createdAt: 'created_at',
  // 想要 updatedAt 但是希望名称叫做 updated_at
  updatedAt: 'updated_at',
  raw: true,
});