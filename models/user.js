// const {Sequelize, DataTypes} = require('sequelize');
// const sequelize = require('../util/database');
// const { name } = require('ejs');

// const User = sequelize.define('users', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: DataTypes.STRING,
//     email: DataTypes.STRING
// });

// module.exports = User;

const { getDB } = require("../util/database");
const MongoClient = require("mongodb");
class user {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
  save() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }
  static findById(userId) {
    const db = getDB();
    return db
      .collection("users")
      .findOne({ _id: new MongoClient.ObjectId(userId) });
  }
}

module.exports = user;
