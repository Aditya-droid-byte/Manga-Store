const User = require("../models/user");
const encrypt = require("bcryptjs");
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
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      encrypt
        .compare(password, user.password)
        .then((isEqualPassword) => {
          if (isEqualPassword) {
            req.session.isUserLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              return res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password");

          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("Session destroyed ");
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  }else{
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password != confirmPassword) {
    return res.redirect("/signup");
  }
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'Email already exist, Please login to continue');
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
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
