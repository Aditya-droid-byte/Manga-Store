const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const exValidator = require("express-validator");

router.get("/add-product", isAuth, adminController.addProducts);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  [
    exValidator.body("title").isString().isLength({ min: 4 }).trim(),
    exValidator.body("imageUrl"),
    exValidator.body("price").isFloat(),
    exValidator.body("description").isLength({ min: 5, max: 200 }).trim(),
  ],
  isAuth,
  adminController.PostProducts
);

router.post(
  "/edit-product",
  [
    exValidator.body("title").isString().isLength({ min: 4 }).trim(),
    exValidator.body("imageUrl").isURL(),
    exValidator.body("price").isFloat(),
    exValidator.body("description").isLength({ min: 5, max: 200 }).trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.get("/edit-product/:productID", isAuth, adminController.editProducts);

router.post("/delete-product", isAuth, adminController.deleteProduct);

module.exports = router;
