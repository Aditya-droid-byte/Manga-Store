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

//Mongoose

// const { getDB } = require("../util/database");
// const MongoClient = require("mongodb");
// class user {
//   constructor(username, email, cart, _id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = _id;
//   }
//   save() {
//     const db = getDB();
//     return db.collection("users").insertOne(this);
//   }
//   addToCart(product) {
//     const updatedCartForUser = this.cart && this.cart.items ? { ...this.cart } : { items: [] };

//     const cartProductIndex = this.cart.items.findIndex(
//       (cp) => cp.ProductId.toString() === product._id.toString()
//     );
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         ProductId: new MongoClient.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDB();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new MongoClient.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   removeItemFromCart(productId) {
//     const db = getDB();
//     const updatedCart = this.cart.items.filter((item) => {
//       console.log("Adding this to updatedCART: ", item.ProductId);
//       return item.ProductId.toString() !== productId.toString();
//     });
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new MongoClient.ObjectId(this._id) },
//         {
//           $set: { cart: { items: updatedCart } },
//         }
//       )
//       .then((result) => {
//         console.log("Updated cart after removing item from cart: ", result);
//         return this.cart;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addOrder() {
//     const db = getDB();
//     return this.getCart()
//       .then((product) => {
//         const order = {
//           items: product,
//           user: {
//             _id: new MongoClient.ObjectId(this._id),
//             username: this.username,
//           },
//         };
//         return db.collection("order").insertOne(order);
//       })
//       .then((result) => {
//         console.log("Result after adding order to order collections: ", result);
//         this.cart = { items: [] };
//         return db.collection("users").updateOne(
//           {
//             _id: new MongoClient.ObjectId(this._id),
//           },
//           {
//             $set: {
//               cart: { items: [] },
//             },
//           }
//         );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   getOrders() {
//     const db = getDB();
//     return db
//       .collection("order")
//       .find({ "user._id": new MongoClient.ObjectId(this._id) })
//       .toArray();
//   }

//   getCart() {
//     const db = getDB();
//     const productId = [];
//     const quantityInUser = {};
//     this.cart.items.forEach((prodDetailInUser) => {
//       console.log("Pritning cart itme one by one: ", prodDetailInUser);
//       productId.push(prodDetailInUser.ProductId);
//       quantityInUser[prodDetailInUser.ProductId] = prodDetailInUser.quantity;
//     });
//     console.log("ProductID: ", productId);
//     console.log("QuantityInUser: ", quantityInUser);

//     return db
//       .collection("products")
//       .find({ _id: { $in: productId } })
//       .toArray()
//       .then((p) => {
//         return p.map((product) => {
//           product.quantity = quantityInUser[product._id];
//           return product;
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static findById(userId) {
//     const db = getDB();
//     return db
//       .collection("users")
//       .findOne({ _id: new MongoClient.ObjectId(userId) });
//   }
// }

// module.exports = user;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};


userSchema.methods.clearCart = function () {
  this.cart = { items: []}
  return this.save();
}

userSchema.methods.removeItemFromCart = function (productId){
   const updatedCart = this.cart.items.filter((item) => {
      console.log("Adding this to updatedCART: ", item);
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCart;
    return this.save();
}
module.exports = mongoose.model("User", userSchema);
