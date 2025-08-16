const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const orderItems = sequelize.define('orderItem', {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  quantity : {
    allowNull: false,
    type: Sequelize.DataTypes.INTEGER
  }
});
module.exports=orderItems;