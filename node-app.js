const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const expressHBS = require("express-handlebars");
const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const path = require("path");
const error = require("./controllers/error");
const User = require("./models/user");
const { connectToMongo } = require('./util/database');
//const db = require("./util/database");
//const sequelize = require("./util/database");
// const Product = require("./models/products");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

// app.engine(
//   "hbs",
//   expressHBS.engine({
//     extname: "hbs",
//     defaultLayout: "main-layout",
//     layoutsDir: "",
//   })
// );
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("68a0a57ac11ecaf8c689b03d")
    .then((user) => {
      req.user = new User(user.user, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(error.get404);

// Product.belongsTo(User, {
//   constraints: true,
//   onDelete: "CASCADE",
// });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });
// sequelize
//   //.sync({ force: true })
//   .sync()
//   .then((result) => {
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({ name: "Aditya", email: "aditya@test.com" });
//     }
//     return user;
//   })
//   .then((user) => {
//     console.log(user);
//     user.getCart().then((cart) => {
//       if (cart) {
//         return user.cart;
//       } else {
//         return user.createCart();
//       }
//     });
//   })
//   .then((cart) => {
//     app.listen(4200);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
connectToMongo()
  .then(() => {
    app.listen(4200, () => {
      console.log("🚀 Server running on http://localhost:4200");
    });
  })
  .catch(err => {
    console.error("❌ Failed to connect to MongoDB", err);
  });