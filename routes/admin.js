const express = require("express");
const router = express.Router();
const adminController = require('../controllers/admin');



router.get('/add-product', adminController.addProducts);

router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.PostProducts);

router.post('/edit-product', adminController.postEditProduct);

router.get('/edit-product/:productID', adminController.editProducts);

router.post('/delete-product', adminController.deleteProduct);


module.exports = router;
