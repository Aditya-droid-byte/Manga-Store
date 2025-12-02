const User = require("../models/user");
const encrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const exValidator = require("express-validator");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "use your own email",
    pass: "**REMOVED**",
  },
});
exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('; ')[0].trim().split('=')[1];
  // console.log(isLoggedIn);
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/Login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isUserLoggedIn,
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = exValidator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "login",
      errorMessage: errors.array()[0].msg,
      isAuthenticated: req.session.isUserLoggedIn,
      oldInput: { email: email, password: password },
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "login",
          errorMessage: "Invalid email or password",
          isAuthenticated: req.session.isUserLoggedIn,
          oldInput: { email: email, password: password },
        });
      }
      encrypt
        .compare(password, user.password)
        .then((isEqualPassword) => {
          if (isEqualPassword) {
            req.session.isUserLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              transporter.sendMail({
                to: email,
                subject: "login success at MangaStore",
                html: "<h1> You have logged in successfully <h1>",
              });
              res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "login",
            errorMessage: "Invalid email or password",
            isAuthenticated: req.session.isUserLoggedIn,
            oldInput: { email: email, password: password },
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("Session destroyed ");
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = exValidator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      isAuthenticated: req.session.isUserLoggedIn,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
    });
  }
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exist, Please login to continue");
        return res.redirect("signup");
      }
      return encrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          transporter.sendMail({
            to: email,
            subject: "SignUp succeeded at mangaStore",
            html: "<h1> You have signed up successfully <h1>",
          });
          return res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "reset",
    pageTitle: "Reset Password",
    isAuthenticated: req.session.isUserLoggedIn,
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const email = req.body.email;
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with this user is found");
          res.redirect("/reset");
          return Promise.reject("USER_NOT_FOUND: " + email);
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return transporter.sendMail({
          to: email,
          subject: "Reset password",
          html: `
            <p> You requested for password reset of your MangaStore account. If not by you please ignore this email</p>
            <p> Click the <a href="http://localhost:4200/reset/${email}/${token}">link</a> to reset your password </p>
            `,
        });
      })
      .catch((err) => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  const email = req.params.email;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Update password",
        errorMessage: message,
        userId: user._id.toString(),
        isAuthenticated: req.session.isUserLoggedIn,
        passwordToken: token,
        email: email,
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const email = req.body.email;
  let resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return encrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      console.log("password updated successfullu");
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        subject: "Reset password",
        html: "Your password has been updated successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
