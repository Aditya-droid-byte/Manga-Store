const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");
const exValidator = require("express-validator");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    exValidator.check("email").
    isEmail().
    withMessage("Invalid email").normalizeEmail(),
    exValidator.check("password", "Invalid password").
    isLength({ min: 6 }).trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    exValidator
      .check("email")
      .isEmail()
      .withMessage("Please enter a valid email").normalizeEmail(),
    exValidator
      .check("password", "Please enter atleast 6 character for password")
      .isLength({ min: 6 }).trim(),
    exValidator.check("confirmPassword").trim().custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password mismatch");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.get("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:email/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
