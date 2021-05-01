const sequelize = require('../mysql/init');
const { DataTypes } = require('sequelize');

!(async function () {
  await sequelize.sync({ force: true });
  // await sequelize.sync({ alter: true });
  console.log('所有书名列表模型均已成功.');
})();
module.exports = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(20),
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
