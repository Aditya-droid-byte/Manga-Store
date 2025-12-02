const Product = require("../models/products");
const user = require("../models/user");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const pdfDoc = require("pdfkit");
//const cart = require("../models/cart");

// exports.getProducts = (req, res, next) => {
//   const products = Product.fetchAll();
//   products.then((productList) => {
//     console.log(productList.length);
//     res.render("shop", {
//       prods: productList,
//       pageTitle: "Shop",
//       path: "/shop",
//       hasProducts: productList.length > 0,
//       issShop: true,
//       activeShop: true,
//     });
//   });
//   products.catch((err)=>{
//     console.log(err);
//   })
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isUserLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  //res.sendFile(path.join(routePath, 'views', 'shop.html'));
};

exports.getProduct = (req, res, next) => {
  const queryParams = req.params.productID;
  Product.findById(queryParams)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isUserLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  //res.sendFile(path.join(routePath, 'views', 'shop.html'));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      //  console.log("------------->", products);
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isUserLoggedIn,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        product: user.cart.items,
        isAuthenticated: req.session.isUserLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // cart.getCart((cart) => {
  //   console.log("---------->", cart);
  //   Product.fetchAll((products) => {
  //     console.log("------------------------->", products);
  //     const cartProduct = [];
  //     if (cart !== null) {
  //       for (let product of products) {
  //         console.log("---------->", cart.products);

  //         const cartProductData = cart.products.find(
  //           (prod) => prod.id === product.id
  //         );
  //         if (cartProductData) {
  //           cartProduct.push({
  //             productData: product,
  //             qty: cartProductData.qty,
  //           });
  //         }
  //       }
  //     }
  //     console.log("length", cartProduct.length);
  //     console.log("cartProduct", cartProduct);
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       product: cartProduct,
  //     });
  //   });
  // });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeItemFromCart(prodId)
    // .then((cart) => {
    //   return cart.getProducts({ where: { id: prodId } });
    // })
    // .then((products) => {
    //   const product = products[0];
    //   return product.cartItem.destroy();
    // })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // Product.findByID(prodId, (product) => {
  //   cart.deleteProduct(prodId, product.price);
  //   return res.redirect("/cart");
  // });
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productID;
  Product.findById(productID)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: productID } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(productID); //returning the general product data
  //   })
  //   .then((data) => {
  //     return fetchedCart.addProduct(data, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  ///////////////////////////////////////
  // Product.findByID(productID, (product) => {
  //   cart.addProduct(productID, product.price);
  // });
  //////////////////////////////////////////
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Orders",
        orders: orders,
        isAuthenticated: req.session.isUserLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found"));
      }
      if (order.user.userId != req.user._id.toString()) {
        return next(new Error("Unauthoirized user access"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);
      const pdfDocument = new pdfDoc();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDocument.pipe(fs.createWriteStream(invoicePath));
      pdfDocument.pipe(res);

      pdfDocument.fontSize(26).text("Invoice");

      pdfDocument.text("-------------------------------");
      let totalPrice = 0
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price
        pdfDocument.fontSize(14).text(
          prod.product.title +
            " : " +
            prod.quantity +
            " * " +
            "Rs" +
            prod.product.price
        );
      });
      pdfDocument.text("-------------------------------");
     
      pdfDocument.text('Total price: Rs '+ totalPrice)

      pdfDocument.end();

      ///////////////////
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     console.log(err);
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
      //   res.send(data);

      ///////////////////////////////
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   'inline; filename="' + invoiceName + '"'
      // );
      // file.pipe(res);
    })
    .catch((err) => {
      console.log("Came here: " + err);
      next(err);
    });
};
