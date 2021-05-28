module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.session.returnTo = req.originalUrl 
        req.flash('error', 'You must be signed in')
        //return, otherwiser the code below will still run
        return res.redirect('/login')
    }
    next()
}

// req.user:   {
//     _id: 60b0edfcae669454b75f0d8d,
//     email: 'crcky4826@gmail.com',
//     username: 'eleanor',
//     __v: 0
//   }