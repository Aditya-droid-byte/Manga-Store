// const mySql = require('mysql2');

// const pool = mySql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'shop_store',
//     password: 'Aditya7348'
// });

// module.exports = pool.promise();

// const Sequelize = require("sequelize");

// const Sequelize = require("sequelize").Sequelize
// const sequelize = new Sequelize("shop_store", "root", "Aditya7348", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;
// const mongodb = require("mongodb");
// const MongoClient = new mongodb.MongoClient(uri);
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const mongoClient = (callback) => {
//   MongoClient.connect()
//   .then(result => {
//     console.log("✅ MongoDB connected");
//     callback(result)
//   })
//   .catch((err) => {
//     console.error("❌ Connection error", err);
//   });
// };
// module.exports = mongoClient;
const { MongoClient } = require('mongodb');

//const uri = "mongodb://localhost:27017";
const uri = "mongodb+srv://srivastavaadi247:DiBmVvAYVL5k8aYx@cluster0.vj62rgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db;

function connectToMongo() {
  return client.connect()
    .then(() => {
      console.log("✅ MongoDB connected");
      db = client.db("Shop_Store");
      console.log("Intialized Database -------> ",db
        
      )
    });
}

function getDB() {
  if (!db) {
    throw new Error("❌ DB not initialized. Call connectToMongo() first.");
  }
  return db;
}

module.exports = {
  connectToMongo,
  getDB
};
