exports.get404 = (req, res, next) => {
  res.status(404).render("error", 
    { 
      pageTitle: "404 Not found", path: "", 
      isAuthenticated: req.session.isLoggedIn
    });
};
