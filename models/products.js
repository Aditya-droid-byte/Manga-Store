// // const fs = require("fs");
// // const path = require("path");
// const Cart = require("./cart");
// const db = require('../util/database')

// // const p = path.join(
// //   path.dirname(require.main.filename),
// //   "data",
// //   "product.json"
// // );

// // const getDataFromFile = (cb) => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       return cb([]);
// //     }
// //     return cb(JSON.parse(fileContent));
// //   });
// // };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     // getDataFromFile((product) => {
//     //   if (this.id) {
//     //     const exisitngProductIndex = product.findIndex(
//     //       (prod) => prod.id === this.id
//     //     );
//     //     const updatedProduct = [...product];
//     //     updatedProduct[exisitngProductIndex] = this;
//     //     fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
//     //       console.log(err);
//     //     });
//     //   } else {
//     //     this.id = Math.random().toString();
//     //     product.push(this);
//     //     fs.writeFile(p, JSON.stringify(product), (err) => {
//     //       console.log(err);
//     //     });
//     //   }
//     // });
//     return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)', [this.title, this.price, this.description, this.imageUrl]);
//   }

//   //   static fetchAll() {
//   //     const p = path.join(
//   //       path.dirname(require.main.filename),
//   //       "data",
//   //       "product.json"
//   //     );
//   //     return new Promise((resolve, reject) => {
//   //       fs.readFile(p, (err, fileContent) => {
//   //         if (err) {
//   //           return reject(err);
//   //         }
//   //         resolve(JSON.parse(fileContent));
//   //       });
//   //     });
//   //   }
//   // static fetchAll(cb) {
//   //   getDataFromFile(cb);
//   // }
//   static fetchAll() {
//     return db.execute('SELECT * FROM products')
//   }
//   // static findByID(id, cb) {
//   //   getDataFromFile((products) => {
//   //     const product = products.find((p) => p.id == id);
//   //     cb(product);
//   //   });
//   // }
//   static findByID(id) {
//     return db.execute("SELECT * FROM products WHERE id = ?", [id])
//   }

//   static deleteById(id) {
//     getDataFromFile((product) => {
//       const productPrice = product.find((prod) => prod.id === id);
//       const updatedProduct = product.filter((prod) => prod.id !== id);
//       fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
//         if (!err) {
//           console.log("Deleting product from cart");
//           Cart.deleteProduct(id, productPrice.price);
//         }
//       });
//     });
//   }
// };

////////////////////////////////Mongodb//////////////////////////////

/* 
const { getDB } = require("../util/database");
const MongoDB = require("mongodb");
const user = require("./user");
class Product {
  constructor(title, price, imageUrl, description, _id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = _id ? new MongoDB.ObjectId(_id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDB();
    let dbOp;
    if (this._id) {
      console.log("updating product for _id", this._id);
      dbOp = db
        .collection("products")
        .updateOne({ _id: new MongoDB.ObjectId(this._id) }, { $set: this });
      console.log("*************Product updated (product.js)*************");
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static findAll() {
    const db = getDB();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log("Found all product in DB");
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDB();
    return db
      .collection("products")
      .find({ _id: new MongoDB.ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log("Found product by ID: ", product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static Destroy(prodID) {
    const db = getDB();
    return db
      .collection("products")
      .deleteOne({ _id: new MongoDB.ObjectId(prodID) })
      .then((result) => {
        console.log("result ----------->: ", result);
        return db.collection("users").updateMany(
          {},
          {
            $pull: {
              "cart.items": { ProductId: new MongoDB.ObjectId(prodID) },
            },
          }
        );
      })
      .then((result) => {
        console.log("item deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}



*/

///////////////////////////////////////////////////////////////
////////Mongooose//////////////////

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
// const {Sequelize, DataTypes} = require('sequelize');
// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//   title: DataTypes.STRING,
//   price: {
//     type: DataTypes.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   description : {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// });

//module.exports = Product;
