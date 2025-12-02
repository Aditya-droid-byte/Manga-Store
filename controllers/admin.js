const Product = require("../models/products");
const exValidator = require("express-validator");
const mongoose = require("mongoose");

exports.addProducts = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Product Page",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isUserLoggedIn,
    hasErrors: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.PostProducts = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasErrors: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      isAuthenticated: req.session.isUserLoggedIn,
      errorMessage: "Attached file is not an image",
      validationErrors: [],
    });
  }
  const errors = exValidator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasErrors: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      isAuthenticated: req.session.isUserLoggedIn,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  const imageUrl = image.path;

  const newProduct = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user._id,
  });
  //mongodb
  newProduct
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  const image = req.file;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;
  const errors = exValidator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasErrors: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId,
      },
      isAuthenticated: req.session.isUserLoggedIn,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        res.redirect("/");
        return Promise.reject("Unauthorized action");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if(image){
        product.imageUrl = image.path;
      }
      return product.save();
    })
    // const newProduct = new Product({
    //   title: updatedTitle,
    //   price: updatedPrice,
    //   imageUrl: updatedImageUrl,
    //   description: updatedDescription,
    // });
    //console.log("Updated product values in cart: ", newProduct);
    // newProduct
    //   .save()
    .then((result) => {
      console.log("Succefully updated product values in DB (admin.js)");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
        isAuthenticated: req.session.isUserLoggedIn,
        hasErrors: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  Product.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId")
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
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

exports.deleteProduct = (req, res, next) => {
  const prodID = req.body.productId;
  Product.deleteOne({ _id: prodID, userId: req.user._id })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
