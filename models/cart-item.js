// const fs = require("fs");
// const path = require("path");

// const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

// module.exports = class cart {
//   static addProduct(id, productPrice) {
//     //fetch previous cart
//     fs.readFile(p, (err, fileContent) => {
//       let cart = { products: [], totalPrice: 0 };
//       if (!err) {
//         cart = JSON.parse(fileContent);
//       }
//       const existingProductIndex = cart.products.findIndex((p) => p.id === id);
//       const existingProduct = cart.products[existingProductIndex];
//       let updatedProduct;
//       if (existingProduct) {
//         updatedProduct = { ...existingProduct };
//         updatedProduct.qty = updatedProduct.qty + 1;
//         cart.products = [...cart.products];
//         cart.products[existingProductIndex] = updatedProduct;
//         console.log("Existing cart: ", cart);
//       } else {
//         updatedProduct = { id: id, qty: 1 };
//         cart.products = [...cart.products, updatedProduct];
//       }
//       cart.totalPrice = cart.totalPrice + +productPrice;
//       fs.writeFile(p, JSON.stringify(cart), (err) => {
//         console.log(err);
//       });
//     });
//     //analyze the cart => increased quantity
//     //add new product increase quantity
//   }

//   static deleteProduct(id, productPrice) {
//     fs.readFile(p, (err, fileContent) => {
//       if (err) {
//         return;
//       }
//       const updatedCart = { ...JSON.parse(fileContent) };
//       const product = updatedCart.products.find((prod) => prod.id === id);
//       if(!product){
//         return;
//       }
//       const productQty = product.qty;
//       updatedCart.products = updatedCart.products.filter(
//         (prod) => prod.id !== id
//       );
//       updatedCart.totalPrice =
//         updatedCart.totalPrice - productPrice * productQty;
//       console.log("updatedCart:", updatedCart);
//       fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static getCart(cb) {
//     fs.readFile(p, (err, fileContent) => {
//       if (err) {
//         return cb(null);
//       } else {
//         const cartProduct = JSON.parse(fileContent);
//         return cb(cartProduct);
//       }
//     });
//   }
// };


const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const cartItems = sequelize.define('cartItem', {
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

module.exports = cartItems;