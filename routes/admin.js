const express = require("express");
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


router.get('/add-product', isAuth, adminController.addProducts);

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product', isAuth, adminController.PostProducts);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.get('/edit-product/:productID', isAuth, adminController.editProducts);

router.post('/delete-product', isAuth, adminController.deleteProduct);


module.exports = router;
