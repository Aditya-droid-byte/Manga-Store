exports.getLogin = (req, res, next) =>{ 
    // const isLoggedIn = req.get('Cookie').split('; ')[0].trim().split('=')[1];
    // console.log(isLoggedIn);
    console.log('IsUserLoggedIn: '+ req.session.isUserLoggedIn)
    res.render('auth/Login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isUserLoggedIn
    })
}


exports.postLogin = (req, res, next) => {
    req.session.isUserLoggedIn = true;
    res.redirect('/');
}