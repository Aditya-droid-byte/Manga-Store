const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const expressHBS = require("express-handlebars");
const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const path = require("path");
const error = require("./controllers/error");
const User = require("./models/user");
const csrf = require("csurf");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const mongoDBSession = require("connect-mongodb-session")(session);
const mongodbUri =
  "mongodb+srv://srivastavaadi247:DiBmVvAYVL5k8aYx@cluster0.vj62rgt.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";
const store = new mongoDBSession({
  uri: mongodbUri,
  collection: "sessions",
});
//const { connectToMongo } = require('./util/database');
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

app.use(
  session({
    secret: "AnewKeyForSession",
    saveUninitialized: false,
    resave: false,
    store: store,
  })
);

const csrfToken = csrf();
app.use(csrfToken);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoute);
app.use(shopRoute);
app.use(authRoute);
app.use("/500", error.get500);
app.use(error.get404);
app.use((err, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "500 Technical error occured",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

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

//Replacing it with mongooes
// connectToMongo()
//   .then(() => {
//     app.listen(4200, () => {
//       console.log("🚀 Server running on http://localhost:4200");
//     });
//   })
//   .catch(err => {
//     console.error("❌ Failed to connect to MongoDB", err);
//   });

mongoose
  .connect(mongodbUri)
  .then((result) => {
    // const user = new User({
    //   name: "Aditya",
    //   email: "aditya@test.com",
    //   cart: {
    //     items: [],
    //   },
    // });
    // user.save();
    app.listen(4200);
  })
  .catch((err) => {
    console.log(err);
  });
