const Product = require("../models/products");

exports.addProducts = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Product Page",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.PostProducts = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const newProduct = new Product(title, price, imageUrl, description);
  //mongodb
  newProduct
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });

  //sequalize
  // req.user
  //   .createProduct({
  //     title: title,
  //     description: description,
  //     price: price,
  //     imageUrl: imageUrl,
  //   })
  //   .then((result) => {
  //     console.log("Created Product");
  //     res.redirect("/");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;
  const newProduct = new Product(
    updatedTitle,
    updatedPrice,
    updatedImageUrl,
    updatedDescription,
    prodId
  );
  console.log("Updated product values in cart: ", newProduct);
  newProduct
    .save()
    .then((result) => {
      console.log("Succefully updated product values in DB (admin.js)");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.editProducts = (req, res, next) => {
  const editProducts = req.query.edit;
  if (!editProducts) {
    return res.redirect("/");
  }
  const productId = req.params.productID;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Page",
        path: "/admin/edit-product",
        editing: editProducts,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // Product.findByID(productId, (product) => {
  //   if (!product) {
  //     return res.redirect("/");
  //   }
  //   res.render("admin/edit-product", {
  //     pageTitle: "Edit Page",
  //     path: "/admin/edit-product",
  //     editing: editProducts,
  //     product: product,
  //   });
  // });
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodID = req.body.productId;
  Product.Destroy(prodID)
    .then((result) => {
      console.log("Destroyed Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
