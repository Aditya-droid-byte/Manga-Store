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
  constructor(username, email, cart, _id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = _id;
  }
  save() {
    const db = getDB();
    return db.collection("users").insertOne(this);
  }
  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.ProductId.toString() === product._id.toString()
    );
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        ProductId: new MongoClient.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDB();
    return db
      .collection("users")
      .updateOne(
        { _id: new MongoClient.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }
  static findById(userId) {
    const db = getDB();
    return db
      .collection("users")
      .findOne({ _id: new MongoClient.ObjectId(userId) });
  }
}

module.exports = user;
