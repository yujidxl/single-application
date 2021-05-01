const sequelize = require('../mysql/init');
const { DataTypes } = require('sequelize');

!(async function () {
  await sequelize.sync({ force: true });
  // await sequelize.sync({ alter: true });
  console.log('所有章节详情模型均已同步.');
})();

module.exports = sequelize.define(
  'ChapterDetail',
  {
    chapter_detail_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    chapter_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    chapter_detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    // 想要 updatedAt 但是希望名称叫做 updated_at
    updatedAt: 'updated_at',
  }
);
