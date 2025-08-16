
const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const order = sequelize.define('order', {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  }
  // quantity: Sequelize.DataTypes.INTEGER 
});

module.exports = order;