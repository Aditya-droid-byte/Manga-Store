const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');


router.get("/login", authController.getLogin);

router.get('/signup', authController.getSignup)

router.post("/login", authController.postLogin);

router.post('/signup', authController.postSignup)

router.get("/logout", authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:email/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);




module.exports = router;